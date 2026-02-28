const pool = require('../config/db');

class MetricsRepository {
  /**
   * Retrieves the last N transactions for a specific gateway.
   * @param {string} gatewayName 
   * @param {number} limit 
   * @returns {Promise<Array>}
   */
  async getLastNTransactions(gatewayName, limit = 20) {
    const res = await pool.query(
      `SELECT status, latency FROM transactions 
       WHERE gateway = $1 
       ORDER BY timestamp DESC LIMIT $2`,
      [gatewayName, limit]
    );
    return res.rows;
  }

  /**
   * Retrieves overall aggregations for all gateways.
   * @returns {Promise<Object>}
   */
  async getOverallMetrics() {
    const res = await pool.query(`
      SELECT 
        COUNT(id) as total_transactions,
        SUM(CASE WHEN status = 'SUCCESS' THEN 1 ELSE 0 END) as successful_transactions,
        SUM(CASE WHEN status = 'FAILED' THEN 1 ELSE 0 END) as failed_transactions
      FROM transactions
    `);
    
    const distRes = await pool.query(`
      SELECT gateway, COUNT(id) as count 
      FROM transactions 
      GROUP BY gateway
      ORDER BY gateway ASC
    `);

    return {
      summary: res.rows[0],
      distribution: distRes.rows
    };
  }
}

module.exports = new MetricsRepository();
