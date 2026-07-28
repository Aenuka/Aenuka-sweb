import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { handler as submitContact } from "./src/functions/submit-contact.js";

function localNetlifyFunctions() {
  return {
    name: "local-netlify-functions",
    configureServer(server) {
      server.middlewares.use("/.netlify/functions/submit-contact", async (req, res) => {
        const chunks = [];
        for await (const chunk of req) chunks.push(chunk);

        try {
          const result = await submitContact({
            httpMethod: req.method,
            headers: req.headers,
            body: Buffer.concat(chunks).toString("utf8"),
          });

          res.statusCode = result.statusCode || 200;
          Object.entries(result.headers || {}).forEach(([key, value]) => {
            res.setHeader(key, value);
          });
          res.end(result.body || "");
        } catch (error) {
          console.error("Local contact function failed:", error);
          res.statusCode = 500;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ error: "Local contact function failed" }));
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), localNetlifyFunctions()],
  build: { outDir: "dist", emptyOutDir: true },
});
