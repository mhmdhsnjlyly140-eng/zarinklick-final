const { Client } = require('pg');
const dbConfig = require('../db-config');

module.exports = async function handler(req, res) {
  const client = new Client(dbConfig);

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
