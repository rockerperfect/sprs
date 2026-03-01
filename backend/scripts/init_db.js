require('dotenv').config();
const pool = require('../src/config/db');

const initDb = async () => {
  const client = await pool.connect();
  try {
    console.log('Initialising database schema...');

    await client.query(`
      CREATE TABLE IF NOT EXISTS transactions (
        id UUID PRIMARY KEY,
        gateway TEXT NOT NULL,
        status TEXT NOT NULL,
        latency FLOAT NOT NULL,
        timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS gateway_stats (
        gateway TEXT PRIMARY KEY,
        success_rate FLOAT DEFAULT 1.0,
        avg_latency FLOAT DEFAULT 0.0,
        total_requests INT DEFAULT 0,
        health_score FLOAT DEFAULT 1.0,
        consecutive_failures INT DEFAULT 0,
        status TEXT DEFAULT 'Healthy',
        circuit_state TEXT DEFAULT 'CLOSED',
        last_failure_timestamp TIMESTAMPTZ DEFAULT NULL
      );
    `);

    // Add last_failure_timestamp column if it doesn't exist yet (safe migration)
    await client.query(`
      ALTER TABLE gateway_stats 
      ADD COLUMN IF NOT EXISTS last_failure_timestamp TIMESTAMPTZ DEFAULT NULL;
    `);

    // Seed initial gateway rows (safe — does nothing if they already exist)
    const gateways = ['Gateway-A', 'Gateway-B', 'Gateway-C'];
    for (const gw of gateways) {
      await client.query(
        `INSERT INTO gateway_stats (gateway)
         VALUES ($1)
         ON CONFLICT (gateway) DO NOTHING;`,
        [gw]
      );
    }

    console.log('Database initialised successfully.');
  } catch (err) {
    console.error('Error initialising database:', err);
    throw err;
  } finally {
    client.release();
  }
};

module.exports = initDb;
