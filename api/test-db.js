const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:...' //npg_NaeEJrVP0ji2@ep-hidden-surf-a70uze4w-pooler.ap-southeast-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require
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
