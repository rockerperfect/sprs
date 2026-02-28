const express = require('express');
const router = express.Router();
const simulateController = require('../controllers/simulate.controller');

router.post('/simulate-bulk', simulateController.simulateBulk);

module.exports = router;
