import "dotenv/config";
import { createHmac, randomBytes, randomInt, timingSafeEqual } from "node:crypto";
import { neon } from "@neondatabase/serverless";
import nodemailer from "nodemailer";
import { adminSessionToken, hashAdminToken, setupAdminAuth, verifyAdminSession } from "./_admin-auth.js";

const headers = {
  "Content-Type": "application/json",
  "Cache-Control": "no-store",
};

const response = (statusCode, data, extraHeaders = {}) => ({
  statusCode,
  headers: { ...headers, ...extraHeaders },
  body: JSON.stringify(data),
});

function normalizeEmail(value) {
  return String(value || "").trim().toLowerCase().slice(0, 254);
}

function hashCode(email, code, secret) {
  return createHmac("sha256", secret).update(`${email}:${code}`).digest("hex");
}

function sameHash(a, b) {
  const first = Buffer.from(a || "", "hex");
  const second = Buffer.from(b || "", "hex");
  return first.length === second.length && first.length > 0 && timingSafeEqual(first, second);
}

function requesterIp(event) {
  return String(event.headers?.["x-nf-client-connection-ip"] || "unknown").slice(0, 80);
}

function sessionCookie(event, token, maxAge) {
  const host = String(event.headers?.host || "");
  const secure = host.includes("localhost") || host.startsWith("127.0.0.1") ? "" : "; Secure";
  return `aenuka_admin_session=${encodeURIComponent(token)}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${maxAge}${secure}`;
}

function otpEmail(code) {
  return {
    subject: `${code} is your Aenuka admin verification code`,
    text: `Your Aenuka admin verification code is ${code}. It expires in 10 minutes. If you did not request this code, you can ignore this email.`,
    html: `
      <div style="background:#f5f5f7;padding:40px 20px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#1d1d1f">
        <div style="max-width:520px;margin:0 auto;background:#fff;border-radius:24px;padding:36px;text-align:center">
          <div style="font-size:13px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:#0071e3">Aenuka Admin</div>
          <h1 style="font-size:28px;letter-spacing:-.03em;margin:18px 0 8px">Verification code</h1>
          <p style="color:#6e6e73;line-height:1.6;margin:0">Use this one-time code to sign in. It expires in 10 minutes.</p>
          <div style="font-size:38px;font-weight:700;letter-spacing:.2em;margin:30px 0;color:#1d1d1f">${code}</div>
          <p style="font-size:12px;color:#86868b;line-height:1.5;margin:0">If you didn’t request this code, you can safely ignore this email.</p>
        </div>
      </div>
    `,
  };
}

export async function handler(event) {
  if (event.httpMethod !== "POST") return response(405, { error: "Method not allowed." });

  const connectionString = process.env.NEON_DB_URL || process.env.DATABASE_URL || process.env.POSTGRES_URL;
  const adminEmail = normalizeEmail(process.env.ADMIN_EMAIL);
  const mailUser = process.env.EMAIL_USER;
  const mailPass = process.env.EMAIL_PASS;
  const otpSecret = process.env.OTP_SECRET;
  if (!connectionString || !adminEmail || !mailUser || !mailPass || !otpSecret) {
    return response(500, { error: "Admin email verification is not fully configured." });
  }

  let body;
  try {
    body = JSON.parse(event.body || "{}");
  } catch {
    return response(400, { error: "Invalid request." });
  }

  const sql = neon(connectionString);
  try {
    await setupAdminAuth(sql);
    await sql`DELETE FROM admin_otp_codes WHERE expires_at < NOW() - INTERVAL '1 day'`;

    if (body.action === "requestOtp") {
      const email = normalizeEmail(body.email);
      if (!email || email !== adminEmail) {
        return response(200, { ok: true, message: "If this email is authorized, a verification code has been sent." });
      }

      const ip = requesterIp(event);
      const recent = await sql`
        SELECT id FROM admin_otp_codes
        WHERE email=${email} AND created_at > NOW() - INTERVAL '60 seconds'
        LIMIT 1
      `;
      if (recent.length) return response(429, { error: "A code was recently sent. Enter that code or wait one minute to request another.", canVerify: true });
      const hourly = await sql`
        SELECT COUNT(*)::INTEGER AS count FROM admin_otp_codes
        WHERE email=${email} AND created_at > NOW() - INTERVAL '1 hour'
      `;
      if (hourly[0]?.count >= 5) return response(429, { error: "Too many codes requested. Please try again later." });

      const code = randomInt(100000, 1000000).toString();
      const codeHash = hashCode(email, code, otpSecret);
      await sql`
        UPDATE admin_otp_codes SET consumed_at=NOW()
        WHERE email=${email} AND consumed_at IS NULL
      `;
      const [record] = await sql`
        INSERT INTO admin_otp_codes (email, code_hash, requester_ip, expires_at)
        VALUES (${email}, ${codeHash}, ${ip}, NOW() + INTERVAL '10 minutes')
        RETURNING id
      `;

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: { user: mailUser, pass: mailPass },
      });
      try {
        await transporter.sendMail({
          from: mailUser,
          to: adminEmail,
          ...otpEmail(code),
        });
      } catch (error) {
        await sql`DELETE FROM admin_otp_codes WHERE id=${record.id}`;
        console.error("Admin OTP email failed:", error);
        return response(502, { error: "The verification email could not be sent." });
      }

      return response(200, { ok: true, message: "Verification code sent." });
    }

    if (body.action === "verifyOtp") {
      const email = normalizeEmail(body.email);
      const code = String(body.code || "").replace(/\D/g, "").slice(0, 6);
      if (email !== adminEmail || code.length !== 6) {
        return response(401, { error: "Invalid or expired verification code." });
      }

      const [record] = await sql`
        SELECT id, code_hash, attempts FROM admin_otp_codes
        WHERE email=${email} AND consumed_at IS NULL AND expires_at > NOW() AND attempts < 5
        ORDER BY created_at DESC
        LIMIT 1
      `;
      const providedHash = hashCode(email, code, otpSecret);
      if (!record || !sameHash(record.code_hash, providedHash)) {
        if (record) await sql`
          UPDATE admin_otp_codes SET attempts=LEAST(attempts + 1, 5)
          WHERE id=${record.id} AND consumed_at IS NULL
        `;
        return response(401, { error: "Invalid or expired verification code." });
      }

      const consumed = await sql`
        UPDATE admin_otp_codes SET consumed_at=NOW()
        WHERE id=${record.id} AND consumed_at IS NULL AND expires_at > NOW() AND attempts < 5
        RETURNING id
      `;
      if (!consumed.length) return response(401, { error: "Invalid or expired verification code." });
      await sql`DELETE FROM admin_sessions WHERE expires_at <= NOW()`;
      const token = randomBytes(32).toString("base64url");
      const tokenHash = hashAdminToken(token);
      const [session] = await sql`
        INSERT INTO admin_sessions (email, token_hash, expires_at)
        VALUES (${email}, ${tokenHash}, NOW() + INTERVAL '12 hours')
        RETURNING expires_at
      `;
      return response(
        200,
        { ok: true, expiresAt: session.expires_at },
        { "Set-Cookie": sessionCookie(event, token, 60 * 60 * 12) },
      );
    }

    if (body.action === "verifySession") {
      const valid = await verifyAdminSession(sql, event);
      return valid ? response(200, { ok: true }) : response(401, { error: "Session expired." });
    }

    if (body.action === "logout") {
      const token = adminSessionToken(event);
      if (token) {
        const tokenHash = hashAdminToken(token);
        await sql`DELETE FROM admin_sessions WHERE token_hash=${tokenHash}`;
      }
      return response(200, { ok: true }, { "Set-Cookie": sessionCookie(event, "", 0) });
    }

    return response(400, { error: "Unknown action." });
  } catch (error) {
    console.error("Admin auth function error:", error);
    return response(500, { error: error.message || "Authentication failed." });
  }
}
