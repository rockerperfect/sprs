const express = require('express');
const router = express.Router();
const gatewayController = require('../controllers/gateway.controller');

router.get('/', gatewayController.getGatewayHealth);

module.exports = router;
