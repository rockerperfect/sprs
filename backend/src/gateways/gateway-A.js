const BaseGateway = require('./baseGateway');

class GatewayA extends BaseGateway {
  constructor() {
    // 60% base success rate, 300ms base latency (Primary - moderately reliable)
    super('Gateway-A', 0.60, 300);
  }
}

module.exports = new GatewayA();
