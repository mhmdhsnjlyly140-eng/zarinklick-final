const { Client } = require('pg');

module.exports = async function handler(req, res) {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    const result = await client.query('SELECT NOW()');
    await client.end();
    res.status(200).json({ success: true, time: result.rows[0] });
  } catch (error) {
    await client.end();
    res.status(500).json({ error: error.message });
  }
};
