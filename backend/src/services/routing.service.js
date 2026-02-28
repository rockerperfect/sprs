const gatewayA = require('../gateways/gatewayA');
const gatewayB = require('../gateways/gatewayB');
const gatewayC = require('../gateways/gatewayC');
const circuitBreaker = require('./circuitBreaker.service');
const transactionRepo = require('../repositories/transaction.repository');
const gatewayRepo = require('../repositories/gateway.repository');
const logger = require('../utils/logger');

// Define priority order. 
// A is primary, B is secondary, C is tertiary fallback.
const GATEWAY_PRIORITY = [gatewayA, gatewayB, gatewayC];

class RoutingService {
  async processPayment(paymentData) {
    let lastError = null;

    for (const gateway of GATEWAY_PRIORITY) {
      const gwName = gateway.name;

      // 1. Check Circuit Breaker
      const isAvailable = await circuitBreaker.canExecute(gwName);
      if (!isAvailable) {
        logger.info(`Skipping ${gwName} due to OPEN circuit breaker`);
        continue; // Try next gateway
      }

      // 2. Attempt Processing
      try {
        const result = await gateway.processPayment(paymentData);
        
        // Success Processing
        await circuitBreaker.recordSuccess(gwName);
        
        // Store Transaction asynchronously (don't block response)
        this.logTransaction({
          id: result.transactionId,
          gateway: gwName,
          status: 'SUCCESS',
          latency: result.latency
        });

        return result; // Return early on success

      } catch (error) {
        lastError = error;
        logger.warn(`Payment failed on ${gwName}: ${error.message}`);
        
        // Failure Processing
        await circuitBreaker.recordFailure(gwName);
        
        // Don't log latency for failures yet, or log as 0 or max timeout. We'll use 0 for failure records.
        this.logTransaction({
          id: `txn_fail_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
          gateway: gwName,
          status: 'FAILED',
          latency: 0 
        });

        // Continue to the next priority gateway (Fallback logic)
      }
    }

    // 3. All gateways failed
    logger.error('All payment gateways failed');
    throw new Error('Payment processing failed across all available gateways');
  }

  async logTransaction(transactionData) {
    try {
      await transactionRepo.createTransaction(transactionData);
      
      // Update basic gateway stats here simply by incrementing total_requests and recalculating rolling if needed
      // To prevent race conditions, the robust way would be DB triggers or doing this in a batch worker, 
      // but for simulation, we'll increment strictly here.
      
      // We will do more robust rolling aggregation in Phase 2 Intelligence Layer.
      const stats = await gatewayRepo.getGatewayStats(transactionData.gateway);
      if (stats) {
        await gatewayRepo.updateStats(transactionData.gateway, {
          total_requests: (stats.total_requests || 0) + 1
        });
      }

    } catch (err) {
      logger.error('Failed to log transaction', err);
    }
  }
}

module.exports = new RoutingService();
