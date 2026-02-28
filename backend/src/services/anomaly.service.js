const gatewayRepo = require('../repositories/gateway.repository');
const logger = require('../utils/logger');

class AnomalyService {
  /**
   * Detects if the current success rate deviates significantly
   * from the gateway's inherent/historical baseline.
   * If: CurrentSuccessRate < HistoricalAverage - 20%, mark DEGRADED.
   * @param {string} gatewayName 
   * @param {number} currentSuccessRate 
   */
  async detectAnomaly(gatewayName, currentSuccessRate) {
    try {
      // Retrieve the gateway's baseline defined in the gateway classes
      const gatewayInstance = require(`../gateways/${gatewayName.toLowerCase()}`);
      const historicalAverage = gatewayInstance.baseSuccessRate;

      const deviationThreshold = historicalAverage - 0.20; // 20% drop

      const stats = await gatewayRepo.getGatewayStats(gatewayName);
      let newStatus = stats.status;

      if (currentSuccessRate < deviationThreshold) {
        newStatus = 'Degraded';
        logger.warn(`Anomaly detected for ${gatewayName}: Success rate dropped to ${currentSuccessRate.toFixed(2)} (Baseline: ${historicalAverage})`);
      } else if (stats.circuit_state === 'CLOSED') {
        newStatus = 'Healthy'; // Recovered
      }

      if (newStatus !== stats.status) {
        await gatewayRepo.updateStats(gatewayName, { status: newStatus });
      }

    } catch (err) {
      logger.error(`Error detecting anomaly for ${gatewayName}`, err);
    }
  }
}

module.exports = new AnomalyService();
