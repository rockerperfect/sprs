const BaseGateway = require('./baseGateway');

class GatewayB extends BaseGateway {
  constructor() {
    // 50% base success rate, 150ms base latency (Unreliable gateway for demonstration)
    super('Gateway-B', 0.50, 150);
  }
}

module.exports = new GatewayB();
