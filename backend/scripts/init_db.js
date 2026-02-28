require('dotenv').config();
const { Pool } = require('pg');
const env = require('../src/config/env');

const pool = new Pool({
  connectionString: env.databaseUrl,
});

const initDb = async () => {
  try {
    console.log('Connecting to database...');
    const client = await pool.connect();

    console.log('Creating transactions table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS transactions (
        id UUID PRIMARY KEY,
        gateway TEXT NOT NULL,
        status TEXT NOT NULL,
        latency FLOAT NOT NULL,
        timestamp TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);

    console.log('Creating gateway_stats table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS gateway_stats (
        gateway TEXT PRIMARY KEY,
        success_rate FLOAT DEFAULT 1.0,
        avg_latency FLOAT DEFAULT 0.0,
        total_requests INT DEFAULT 0,
        health_score FLOAT DEFAULT 1.0,
        consecutive_failures INT DEFAULT 0,
        status TEXT DEFAULT 'Healthy',
        circuit_state TEXT DEFAULT 'CLOSED'
      );
    `);

    // Insert initial gateway stats if empty
    const gateways = ['GatewayA', 'GatewayB', 'GatewayC'];
    for (const gw of gateways) {
      await client.query(`
        INSERT INTO gateway_stats (gateway)
        VALUES ($1)
        ON CONFLICT (gateway) DO NOTHING;
      `, [gw]);
    }

    console.log('Database initialized successfully.');
    client.release();
    process.exit(0);
  } catch (err) {
    console.error('Error initializing database:', err);
    process.exit(1);
  }
};

initDb();
