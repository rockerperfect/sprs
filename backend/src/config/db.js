const { Pool } = require('pg');
const env = require('./env');

const isLocalhost =
  env.databaseUrl.includes('localhost') ||
  env.databaseUrl.includes('127.0.0.1');

const pool = new Pool({
  connectionString: env.databaseUrl,
  ssl: !isLocalhost ? { rejectUnauthorized: false } : false,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

module.exports = pool;
