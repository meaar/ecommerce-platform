const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { env } = require('./config/env');
const { authRoutes } = require('./routes/auth.routes');
const { createContainer } = require('./container');
const { profileRoutes } = require('./routes/profile.routes');
const { orderRoutes } = require('./routes/order.routes');
const { healthRoutes } = require('./routes/health.routes');
const { notFoundHandler, errorHandler } = require('./middlewares/error.middleware');

async function createApp() {
  const app = express();
  const container = createContainer();

  await container.userRepository.initialize();
  await container.sessionRepository.initialize();

  app.disable('x-powered-by');
  app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  }));
  app.use(cors({ origin: env.frontendOrigin, credentials: true }));
  app.use(express.json({ limit: '1mb' }));

  app.use('/api/health', healthRoutes);
  app.use('/api/auth', authRoutes(container));
  app.use('/api/profile', profileRoutes(container));
  app.use('/api/orders', orderRoutes(container));

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

module.exports = { createApp };
