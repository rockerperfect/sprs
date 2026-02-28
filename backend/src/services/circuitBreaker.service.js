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
      const lastFailureTime = Number(stats.last_failure_epoch) || 0;
      
      logger.info(`[DEBUG] ${gatewayName} Cooldown Check -> now: ${now}, last: ${lastFailureTime}, diff: ${now - lastFailureTime} (Needs > 60000). Epoch: ${stats.last_failure_epoch}`);

      if (now - lastFailureTime > COOLDOWN_PERIOD_MS) {
        // Try to atomically transition to HALF-OPEN
        const locked = await gatewayRepo.tryLockHalfOpen(gatewayName);
        if (locked) {
          logger.info(`Circuit breaker for ${gatewayName} is now HALF-OPEN`);
          return true; // Allow the probe request through
        } else {
          return false; // Already HALF-OPEN by another concurrent probe
        }
      }
      return false; // Still OPEN, cool down not yet reached
    }

    if (stats.circuit_state === 'HALF-OPEN') {
      // A probe request is already in flight. Reject all other traffic until it resolves.
      return false; 
    }

    return true; // CLOSED
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
   * Uses an atomic database query to solve race conditions during bulk requests.
   * @param {string} gatewayName 
   */
  async recordFailure(gatewayName) {
    const stats = await gatewayRepo.recordGatewayFailure(gatewayName, FAILURE_THRESHOLD);
    if (!stats) return;

    if (stats.circuit_state === 'OPEN') {
      if (stats.consecutive_failures === FAILURE_THRESHOLD) {
        logger.warn(`Circuit breaker for ${gatewayName} tripped to OPEN`);
      } else if (stats.consecutive_failures > FAILURE_THRESHOLD) {
        logger.warn(`Circuit breaker for ${gatewayName} tripped back to OPEN from HALF-OPEN`);
      }
    }
  }
}

module.exports = new CircuitBreakerService();
