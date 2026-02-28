const routingService = require('../services/routing.service');

const simulateBulk = async (req, res) => {
  try {
    const { count } = req.body;
    
    if (!count || count <= 0 || count > 1000) {
      return res.status(400).json({ success: false, error: 'Valid count (1-1000) is required' });
    }

    // Fire and forget or await all depending on load. 
    // We'll await all to give a final response in this synchronous simulation design.
    const promises = [];
    for (let i = 0; i < count; i++) {
      // Small delay distribution to simulate real traffic roughly
      const delay = Math.floor(Math.random() * 50);
      
      const paymentPromise = new Promise(resolve => {
        setTimeout(async () => {
          try {
            await routingService.processPayment({ amount: Math.floor(Math.random() * 500) + 10 });
            resolve(); // We don't need to return success individual results for bulk
          } catch (e) {
            resolve(); // Catch thrown failures so Promise.all won't fast-fail
          }
        }, delay);
      });

      promises.push(paymentPromise);
    }

    await Promise.all(promises);

    res.status(200).json({
      success: true,
      message: `Successfully simulated ${count} transactions`
    });

  } catch (error) {
    res.status(500).json({ success: false, error: 'Bulk simulation failed' });
  }
};

module.exports = {
  simulateBulk
};
