const gatewayRepo = require('../repositories/gateway.repository');

const getGatewayHealth = async (req, res) => {
  try {
    const stats = await gatewayRepo.getAllGatewayStats();
    
    // Map DB output directly to expected UI
    const formattedStats = stats.map(s => ({
      gateway: s.gateway,
      successRate: s.success_rate,
      avgLatency: s.avg_latency,
      healthScore: s.health_score,
      circuitState: s.circuit_state,
      consecutiveFailures: s.consecutive_failures,
      status: s.status,
      totalRequests: s.total_requests
    }));

    res.status(200).json({
      success: true,
      data: formattedStats
    });

  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch gateway health stats' });
  }
};

module.exports = {
  getGatewayHealth
};
