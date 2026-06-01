const { neon } = require('@neondatabase/serverless');

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

  const connectionString = process.env.NEON_DB_URL || process.env.DATABASE_URL || process.env.POSTGRES_URL;

  if (!connectionString) {
    return { statusCode: 500, body: 'Database connection string is not configured' };
  }

  const sql = neon(connectionString);

  try {
    await sql`
      CREATE TABLE IF NOT EXISTS contact_messages (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `;

    await sql`
      INSERT INTO contact_messages (name, email, message)
      VALUES (${name}, ${email}, ${message})
    `;

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Message sent successfully!' })
    };

  } catch (error) {
    console.error("Error in handler:", error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: error.message || 'Server error occurred' })
    };
  }
};
