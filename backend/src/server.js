require('dotenv').config();
const app = require('./app');
const env = require('./config/env');
const logger = require('./utils/logger');
const pool = require('./config/db');
const initDb = require('../scripts/init_db');

const startServer = async () => {
  try {
    // 1. Verify DB connection
    const client = await pool.connect();
    logger.info('Connected to PostgreSQL database');
    client.release();

    // 2. Create tables + seed gateways (idempotent — safe to run every startup)
    await initDb();
    logger.info('Database schema ready');

    // 3. Start Express server
    app.listen(env.port, () => {
      logger.info(`Server is running on port ${env.port} in ${env.nodeEnv} mode`);
    });
  } catch (err) {
    logger.error('Failed to start server:', err);
    process.exit(1);
  }
};

startServer();
