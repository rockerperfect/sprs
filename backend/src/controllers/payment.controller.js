const uuid = require('uuid');
const routingService = require('../services/routing.service');

const processPayment = async (req, res, next) => {
  try {
    const paymentData = req.body;
    
    // Validate request briefly
    if (!paymentData || !paymentData.amount) {
      return res.status(400).json({ success: false, error: 'Payment amount is required' });
    }

    const result = await routingService.processPayment(paymentData);

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(503).json({
      success: false,
      error: error.message
    });
  }
};

module.exports = {
  processPayment
};
