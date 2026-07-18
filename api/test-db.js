const { Pool } = require('pg');

const pool = new Pool({
  host: 'ep-jolly-lab-azzmo2t3-pooler.c-3.ap-southeast-1.aws.neon.tech',
  port: 5432,
  database: 'neondb',
  user: 'neondb_owner',
  password: 'npg_ayNhnpBP9Yx5',
  ssl: { rejectUnauthorized: false }
});

module.exports = async function handler(req, res) {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    client.release();
    res.status(200).json({ success: true, time: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
