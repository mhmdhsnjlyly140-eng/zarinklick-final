const { Client } = require('pg');

module.exports = async function handler(req, res) {
  const client = new Client({
    connectionString: 'postgresql://neondb_owner:posnpg_tgb5vDwZ8TEc@ep-nameless-smoke-auvrbyjl-pooler.c-10.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require' //
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
