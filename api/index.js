const app = require('../backend/src/app');
const initDb = require('../backend/scripts/init_db');

let isInitialized = false;
let initPromise = null;

const ensureDbReady = async () => {
  if (isInitialized) return;
  if (!initPromise) {
    initPromise = initDb()
      .then(() => {
        isInitialized = true;
      })
      .catch((err) => {
        initPromise = null;
        console.error('Failed to initialize database on startup:', err);
        throw err;
      });
  }
  return initPromise;
};

module.exports = async (req, res) => {
  try {
    await ensureDbReady();
    return app(req, res);
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'Database connection failed',
      message: err.message
    });
  }
};
