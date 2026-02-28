const metricsRepo = require('../repositories/metrics.repository');
const gatewayRepo = require('../repositories/gateway.repository');
const anomalyService = require('./anomaly.service');
const logger = require('../utils/logger');

const ROLLING_WINDOW = 20;

class HealthService {
  /**
   * Calculates and updates the health score for a given gateway
   * based on its last N transactions.
   * Score = (0.6 × SuccessRate) + (0.4 × (1 / AvgLatency))
   * @param {string} gatewayName 
   */
  async evaluateHealth(gatewayName) {
    try {
      const recentTxns = await metricsRepo.getLastNTransactions(gatewayName, ROLLING_WINDOW);
      if (recentTxns.length === 0) return;

      let successCount = 0;
      let totalLatency = 0;
      let latencyCount = 0;

      for (const txn of recentTxns) {
        if (txn.status === 'SUCCESS') {
          successCount++;
          totalLatency += txn.latency;
          latencyCount++;
        }
      }

      const recentSuccessRate = successCount / recentTxns.length;
      const recentAvgLatency = latencyCount > 0 ? (totalLatency / latencyCount) : 0;

      // Score Calculation
      // PRD Formula: (0.6 * SuccessRate) + (0.4 * (1 / AvgLatency))
      let latencyComponent = 0;
      if (recentAvgLatency > 0) {
        latencyComponent = 1 / recentAvgLatency;
      } else if (successCount > 0) {
        latencyComponent = 1; // 0 latency
      }

      const healthScore = (0.6 * recentSuccessRate) + (0.4 * latencyComponent);

      // Save the computed metrics
      await gatewayRepo.updateStats(gatewayName, {
        success_rate: recentSuccessRate,
        avg_latency: recentAvgLatency,
        health_score: healthScore
      });

      // Pass results to anomaly detector
      await anomalyService.detectAnomaly(gatewayName, recentSuccessRate);

    } catch (err) {
      logger.error(`Error evaluating health for ${gatewayName}`, err);
    }
  }
}

// Since AnomalyService might require GatewayRepo, and HealthService requires AnomalyService,
// we export HealthService, and we will require AnomalyService cleanly.
module.exports = new HealthService();
