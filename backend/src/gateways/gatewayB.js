const BaseGateway = require('./baseGateway');

class GatewayB extends BaseGateway {
  constructor() {
    // 90% base success rate, 150ms base latency (Faster but slightly less reliable)
    super('GatewayB', 0.90, 150);
  }
}

module.exports = new GatewayB();
