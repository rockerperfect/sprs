const pool = require('../config/db');

class GatewayRepository {
  async getGatewayStats(gatewayName) {
    const res = await pool.query(
      `SELECT * FROM gateway_stats WHERE gateway = $1`,
      [gatewayName]
    );
    return res.rows[0];
  }

  async getAllGatewayStats() {
    const res = await pool.query('SELECT * FROM gateway_stats ORDER BY gateway ASC');
    return res.rows;
  }

  async updateStats(gatewayName, updates) {
    const {
      success_rate,
      avg_latency,
      total_requests,
      health_score,
      consecutive_failures,
      status,
      circuit_state
    } = updates;

    const res = await pool.query(
      `UPDATE gateway_stats
       SET success_rate = COALESCE($1, success_rate),
           avg_latency = COALESCE($2, avg_latency),
           total_requests = COALESCE($3, total_requests),
           health_score = COALESCE($4, health_score),
           consecutive_failures = COALESCE($5, consecutive_failures),
           status = COALESCE($6, status),
           circuit_state = COALESCE($7, circuit_state)
       WHERE gateway = $8
       RETURNING *`,
      [
        success_rate,
        avg_latency,
        total_requests,
        health_score,
        consecutive_failures,
        status,
        circuit_state,
        gatewayName
      ]
    );

    return res.rows[0];
  }
  async resetAllGatewayStats() {
    await pool.query(`
      UPDATE gateway_stats 
      SET success_rate = 1.0, 
          avg_latency = 0.0, 
          total_requests = 0, 
          health_score = 1.0, 
          consecutive_failures = 0, 
          status = 'Healthy', 
          circuit_state = 'CLOSED'
    `);
  }
}

module.exports = new GatewayRepository();
