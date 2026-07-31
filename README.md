## 🌐 www.aenuka.com  
# 🚀 Full-Stack Web App Deployment with Netlify, Neon & Node.js

**aenuka.com** is a full-stack web application originally built as a static site on GitHub Pages. It has since been upgraded with a backend using **Node.js + Express**, connected to a **Neon Serverless Postgres** database, and deployed on **Netlify** with a custom domain and HTTPS.

🌐 Live Site: [**aenuka.com**](https://www.aenuka.com)  
🔒 **SSL Enabled** (HTTPS)  
📬 **Contact form with backend & database integration**

---

## 🧱 Tech Stack

| Layer        | Technology                    |
|--------------|-------------------------------|
| Frontend     | HTML, CSS, JavaScript         |
| Backend      | Node.js, Express              |
| Database     | Neon Serverless Postgres      |
| Hosting      | Netlify (Frontend + Backend)  |
| Initial Host | GitHub Pages (Static Only)    |

---

## ✉️ Contact Form (Working Backend)

This project features a **fully functional contact form** that:

- 📨 Accepts user input (name, email, message)
- ✅ Submits the data to a **Node.js + Express API**
- 💾 Saves entries in a **Neon Serverless Postgres** database
- 🛡️ Validates and sanitizes user input
- 📤 Optionally emails the admin or logs to console/server

## Posts and admin panel

- Public feed: `/posts`
- Unlisted admin login: `/admin`
- Protected dashboard: `/admin/dashboard`
- Local full-stack development: `npm run dev` (including local function routes)

Copy `.env.example` to `.env` and configure `NEON_DB_URL` and
the admin email, mail credentials, and `OTP_SECRET`. Admin access uses a
single-use email code and a secure server-side session. Image uploads
additionally need signed Cloudinary credentials (or an unsigned upload preset).
The required database tables are created automatically on first use.

### API Endpoint Example
