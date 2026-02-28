const pool = require('../config/db');

class GatewayRepository {
  async getGatewayStats(gatewayName) {
    const res = await pool.query(
      `SELECT *, EXTRACT(EPOCH FROM last_failure_timestamp) * 1000 AS last_failure_epoch
       FROM gateway_stats WHERE gateway = $1`,
      [gatewayName]
    );
    return res.rows[0];
  }

  async getAllGatewayStats() {
    const res = await pool.query(`
      SELECT *, EXTRACT(EPOCH FROM last_failure_timestamp) * 1000 AS last_failure_epoch 
      FROM gateway_stats ORDER BY gateway ASC
    `);
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
      circuit_state,
      last_failure_timestamp
    } = updates;

    const res = await pool.query(
      `UPDATE gateway_stats
       SET success_rate = COALESCE($1, success_rate),
           avg_latency = COALESCE($2, avg_latency),
           total_requests = COALESCE($3, total_requests),
           health_score = COALESCE($4, health_score),
           consecutive_failures = COALESCE($5, consecutive_failures),
           status = COALESCE($6, status),
           circuit_state = COALESCE($7, circuit_state),
           last_failure_timestamp = COALESCE($8, last_failure_timestamp)
       WHERE gateway = $9
       RETURNING *`,
      [
        success_rate,
        avg_latency,
        total_requests,
        health_score,
        consecutive_failures,
        status,
        circuit_state,
        last_failure_timestamp,
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

  async incrementTotalRequests(gatewayName) {
    await pool.query(
      `UPDATE gateway_stats SET total_requests = total_requests + 1 WHERE gateway = $1`,
      [gatewayName]
    );
  }

  async recordGatewayFailure(gatewayName, threshold) {
    const res = await pool.query(
      `UPDATE gateway_stats 
       SET 
         consecutive_failures = consecutive_failures + 1,
         last_failure_timestamp = NOW(),
         circuit_state = CASE 
           WHEN consecutive_failures + 1 >= $2 THEN 'OPEN'
           WHEN circuit_state = 'HALF-OPEN' THEN 'OPEN'
           ELSE circuit_state 
         END,
         status = CASE
           WHEN consecutive_failures + 1 >= $2 THEN 'Degraded'
           WHEN circuit_state = 'HALF-OPEN' THEN 'Degraded'
           ELSE status
         END
       WHERE gateway = $1
       RETURNING *`,
      [gatewayName, threshold]
    );
    return res.rows[0];
  }

  async tryLockHalfOpen(gatewayName) {
    const res = await pool.query(
      `UPDATE gateway_stats 
       SET circuit_state = 'HALF-OPEN'
       WHERE gateway = $1 AND circuit_state = 'OPEN' 
       RETURNING *`,
      [gatewayName]
    );
    return res.rowCount > 0;
  }
}

module.exports = new GatewayRepository();
