const BaseGateway = require('./baseGateway');

class GatewayC extends BaseGateway {
  constructor() {
    // 99% base success rate, 600ms base latency (Very reliable but slow)
    super('GatewayC', 0.99, 600);
  }
}

module.exports = new GatewayC();
