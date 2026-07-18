const { Client } = require('pg');

module.exports = async function handler(req, res) {
  const client = new Client({
    connectionString: 'postgresql://neondb_owner:npg_ayNhnpBP9Yx5@ep-jolly-lab-azzmo2t3-pooler.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require',
    ssl: { rejectUnauthorized: true }
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
