require('dotenv').config({ path: './src/.env' });  // Load .env automatically, place .env at your project root or backend folder

const path = require('path');
const fs = require('fs');
const { Client } = require('pg');
const nodemailer = require('nodemailer');

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  let data;
  try {
    data = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, body: 'Invalid JSON' };
  }

  const { name, email, message } = data;
  if (!name || !email || !message) {
    return { statusCode: 400, body: 'Missing required fields' };
  }

  // Validate required environment variables early to provide clearer errors during development
  const requiredEnvs = ['NEON_DB_URL', 'EMAIL_USER', 'EMAIL_PASS', 'ADMIN_EMAIL'];
  const missingEnvs = requiredEnvs.filter(k => !process.env[k]);
  if (missingEnvs.length) {
    console.error('Missing environment variables:', missingEnvs);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Server misconfiguration', missing: missingEnvs })
    };
  }

  // Debug: print DB connection string to verify correct loading
  console.log("Using DB URL:", process.env.NEON_DB_URL);

  const client = new Client({
    connectionString: process.env.NEON_DB_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    // Connect to the database
    await client.connect();

    // Insert the form data into the contact_messages table
    await client.query(
      'INSERT INTO contact_messages (name, email, message) VALUES ($1, $2, $3)',
      [name, email, message]
    );

    // Prepare nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // helper to escape HTML
    const escapeHtml = (str) => {
      if (!str) return '';
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    };

    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeMessage = escapeHtml(message).replace(/\n/g, '<br/>');

    // HTML email template with embedded logo (cid)
    const htmlBody = `
      <div style="font-family:Inter, Arial, Helvetica, sans-serif; color:#111827;">
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
          <tr>
            <td align="center" style="padding:24px 0; background:#ffffff;">
              <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="border-radius:12px; overflow:hidden; border:1px solid #e6e7ea;">
                <tr style="background: #ffffff;">
                  <td style="padding:20px; display:flex; align-items:center; gap:12px;">
                    <img src="cid:logo@aenuin" width="48" height="48" alt="Aenuin" style="display:block; border-radius:4px; object-fit:cover;" />
                    <div>
                      <div style="font-size:18px; font-weight:700; color:#0f172a;">Aenuin</div>
                      <div style="font-size:13px; color:#6b7280;">New contact form submission</div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style="background:#ffffff; padding:24px;">
                    <h3 style="margin:0 0 12px 0; color:var(--primary, #ff0000);">Message details</h3>
                    <p style="margin:6px 0; color:#374151;"><strong>Name:</strong> ${safeName}</p>
                    <p style="margin:6px 0; color:#374151;"><strong>Email:</strong> ${safeEmail}</p>
                    <div style="margin-top:12px; padding:16px; background:#f9fafb; border-radius:8px; color:#111827; line-height:1.5;">
                      ${safeMessage}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style="background:#ffffff; padding:16px 20px; text-align:center; color:#9ca3af; font-size:12px;">
                    This email was sent from your website contact form.
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </div>
    `;

    // Determine logo path relative to this function and include it only if present
    const logoPath = path.resolve(__dirname, '../../public/favicon.png');
    const attachments = [];
    if (fs.existsSync(logoPath)) {
      attachments.push({ filename: 'favicon.png', path: logoPath, cid: 'logo@aenuin' });
    } else {
      console.warn('Logo not found for email attachment at', logoPath);
    }

    // Email content (HTML + plain text fallback). Attach logo only if found.
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      subject: `New Contact Form Submission from ${safeName}`,
      text: `You received a new message from your contact form.\n\nName: ${safeName}\nEmail: ${safeEmail}\nMessage:\n${message}`,
      html: htmlBody,
      attachments
    };

    // Send email to admin
    await transporter.sendMail(mailOptions);

    await client.end();

    // Success response
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Message sent successfully!' })
    };

  } catch (error) {
    console.error("Error in handler:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Server error occurred' })
    };
  }
};
