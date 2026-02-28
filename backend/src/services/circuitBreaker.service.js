const gatewayRepo = require('../repositories/gateway.repository');
const logger = require('../utils/logger');

const FAILURE_THRESHOLD = 5;
const COOLDOWN_PERIOD_MS = 60 * 1000; // 60 seconds

class CircuitBreakerService {
  /**
   * Evaluates if a gateway can accept traffic.
   * @param {string} gatewayName 
   * @returns {Promise<boolean>}
   */
  async canExecute(gatewayName) {
    const stats = await gatewayRepo.getGatewayStats(gatewayName);
    if (!stats) return true; // Fail open if no stats yet

    if (stats.circuit_state === 'OPEN') {
      const now = Date.now();
      const lastFailureTime = new Date(stats.last_failure_timestamp || 0).getTime();
      
      if (now - lastFailureTime > COOLDOWN_PERIOD_MS) {
        // Transition to HALF-OPEN
        await gatewayRepo.updateStats(gatewayName, { circuit_state: 'HALF-OPEN' });
        logger.info(`Circuit breaker for ${gatewayName} is now HALF-OPEN`);
        return true;
      }
      return false; // Still OPEN, cool down not yet reached
    }

    return true; // CLOSED or HALF-OPEN
  }

  /**
   * Records a success.
   * - If circuit is HALF-OPEN: this is the probe success → close and reset fully.
   * - If circuit is CLOSED: simply mark status Healthy; do NOT reset consecutive_failures
   *   (those are only cleared after a HALF-OPEN recovery or explicit reset).
   * @param {string} gatewayName 
   */
  async recordSuccess(gatewayName) {
    const stats = await gatewayRepo.getGatewayStats(gatewayName);
    if (!stats) return;

    if (stats.circuit_state === 'HALF-OPEN') {
      // Probe succeeded – fully close the circuit and reset failures
      await gatewayRepo.updateStats(gatewayName, {
        consecutive_failures: 0,
        circuit_state: 'CLOSED',
        status: 'Healthy'
      });
      logger.info(`Circuit breaker for ${gatewayName} recovered: HALF-OPEN → CLOSED`);
    } else if (stats.circuit_state === 'CLOSED') {
      // Normal success: just ensure status is Healthy; preserve consecutive_failures count
      // (consecutive_failures only resets after a full HALF-OPEN recovery)
      if (stats.status !== 'Healthy') {
        await gatewayRepo.updateStats(gatewayName, { status: 'Healthy' });
      }
    }
  }

  /**
   * Records a failure and trips breaker if threshold is met.
   * @param {string} gatewayName 
   */
  async recordFailure(gatewayName) {
    const stats = await gatewayRepo.getGatewayStats(gatewayName);
    if (!stats) return;

    const newFailures = (stats.consecutive_failures || 0) + 1;
    const updates = {
      consecutive_failures: newFailures,
      last_failure_timestamp: new Date().toISOString()
    };

    if (newFailures >= FAILURE_THRESHOLD) {
      updates.circuit_state = 'OPEN';
      updates.status = 'Degraded';
      logger.warn(`Circuit breaker for ${gatewayName} tripped to OPEN`);
    } else if (stats.circuit_state === 'HALF-OPEN') {
      // If it fails during HALF-OPEN, trip it back to OPEN immediately
      updates.circuit_state = 'OPEN';
      updates.status = 'Degraded';
      logger.warn(`Circuit breaker for ${gatewayName} tripped back to OPEN from HALF-OPEN`);
    }

    await gatewayRepo.updateStats(gatewayName, updates);
  }
}

module.exports = new CircuitBreakerService();
