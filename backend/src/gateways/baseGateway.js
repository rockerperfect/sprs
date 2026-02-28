const { v4: uuidv4 } = require('uuid');

class BaseGateway {
  constructor(name, baseSuccessRate, baseLatency) {
    this.name = name;
    this.baseSuccessRate = baseSuccessRate;
    this.baseLatency = baseLatency; // in ms
  }

  /**
   * Simulates a payment processing delay and success/failure outcome.
   * @param {Object} paymentData 
   * @returns {Promise<Object>} 
   */
  async processPayment(paymentData) {
    // Add jitter to latency (+/- 20% of baseLatency)
    const jitter = this.baseLatency * 0.2;
    const latency = this.baseLatency + (Math.random() * jitter * 2) - jitter;
    
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const isSuccess = Math.random() <= this.baseSuccessRate;
        if (isSuccess) {
          resolve({
            success: true,
            gateway: this.name,
            transactionId: uuidv4(),
            latency: Math.round(latency)
          });
        } else {
          reject(new Error(`Payment failed at ${this.name}`));
        }
      }, latency);
    });
  }
}

module.exports = BaseGateway;
