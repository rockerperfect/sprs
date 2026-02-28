const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const errorHandler = require('./middleware/errorHandler');
const requestLogger = require('./middleware/requestLogger');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(requestLogger);

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

const paymentRoutes = require('./routes/payment.routes');
const metricsRoutes = require('./routes/metrics.routes');
const gatewayRoutes = require('./routes/gateway.routes');
const simulateRoutes = require('./routes/simulate.routes');

app.use('/api/v1/payment', paymentRoutes);
app.use('/api/v1/metrics', metricsRoutes);
app.use('/api/v1/gateway', gatewayRoutes);
app.use('/api/v1', simulateRoutes);

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ success: false, error: 'Route not found' });
});

// Error handling middleware
app.use(errorHandler);

module.exports = app;
