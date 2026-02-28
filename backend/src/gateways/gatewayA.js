const BaseGateway = require('./baseGateway');

class GatewayA extends BaseGateway {
  constructor() {
    // 95% base success rate, 300ms base latency
    super('GatewayA', 0.95, 300);
  }
}

module.exports = new GatewayA();
