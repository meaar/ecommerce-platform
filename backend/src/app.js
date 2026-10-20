const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { env } = require('./config/env');
const { authRoutes } = require('./routes/auth.routes');
const { createContainer } = require('./container');
const { profileRoutes } = require('./routes/profile.routes');
const { orderRoutes } = require('./routes/order.routes');
const { productRoutes } = require('./routes/product.routes');
const { healthRoutes } = require('./routes/health.routes');
const { notFoundHandler, errorHandler } = require('./middlewares/error.middleware');

async function createApp() {
  const app = express();
  const container = createContainer();

  await container.userRepository.initialize();
  await container.sessionRepository.initialize();
  await container.productRepository.initialize();

  app.disable('x-powered-by');
  app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  }));
  app.use(cors({
    origin: (origin, callback) => {
      if (!origin || env.allowedFrontendOrigins.includes(origin) || /^http:\/\/(?:localhost|127\.0\.0\.1|10\.\d+\.\d+\.\d+|192\.168\.\d+\.\d+|172\.(?:1[6-9]|2\d|3[0-1])\.\d+\.\d+):4200$/.test(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error('Origin not allowed by CORS'));
    },
    credentials: true,
  }));
  app.use(express.json({ limit: '1mb' }));

  app.use('/api/health', healthRoutes);
  app.use('/api/auth', authRoutes(container));
  app.use('/api/profile', profileRoutes(container));
  app.use('/api/orders', orderRoutes(container));
  app.use('/api/products', productRoutes(container));

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

module.exports = { createApp };
