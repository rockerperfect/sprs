const metricsRepo = require('../repositories/metrics.repository');

const getMetrics = async (req, res) => {
  try {
    const metrics = await metricsRepo.getOverallMetrics();
    
    // Calculate overall success and failure rates
    const summary = metrics.summary;
    const totalTxns = parseInt(summary.total_transactions, 10);
    const successfulTxns = parseInt(summary.successful_transactions, 10) || 0;
    const failedTxns = parseInt(summary.failed_transactions, 10) || 0;

    const successRate = totalTxns > 0 ? ((successfulTxns / totalTxns) * 100).toFixed(2) : 0;
    const failureRate = totalTxns > 0 ? ((failedTxns / totalTxns) * 100).toFixed(2) : 0;

    // Traffic Distribution
    const trafficDistribution = metrics.distribution.map(item => ({
      gateway: item.gateway,
      count: parseInt(item.count, 10),
      percentage: totalTxns > 0 ? ((parseInt(item.count, 10) / totalTxns) * 100).toFixed(2) : 0
    }));

    res.status(200).json({
      success: true,
      data: {
        totalTransactions: totalTxns,
        successRate: parseFloat(successRate),
        failureRate: parseFloat(failureRate),
        trafficDistribution
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch metrics' });
  }
};

module.exports = {
  getMetrics
};
