const { UserRepository } = require('./repositories/user.repository');
const { SessionRepository } = require('./repositories/session.repository');
const { ProductRepository } = require('./repositories/product.repository');
const { AuthService } = require('./services/auth.service');
const { ProfileService } = require('./services/profile.service');
const { StorageService } = require('./services/storage.service');
const { ProductService } = require('./services/product.service');
const { createAuthController } = require('./controllers/auth.controller');
const { createProfileController } = require('./controllers/profile.controller');
const { createOrderController } = require('./controllers/order.controller');
const { createProductController } = require('./controllers/product.controller');
const { env } = require('./config/env');

function createContainer() {
  const userRepository = new UserRepository(env.database);
  const sessionRepository = new SessionRepository(env.database);
  const productRepository = new ProductRepository(env.database);
  const storageService = new StorageService();
  const authService = new AuthService(userRepository, sessionRepository);
  const profileService = new ProfileService(userRepository, storageService);
  const productService = new ProductService(productRepository, storageService);

  return {
    authController: createAuthController(authService, sessionRepository),
    profileController: createProfileController(profileService),
    orderController: createOrderController(),
    productController: createProductController(productRepository, productService),
    userRepository,
    sessionRepository,
    productRepository,
  };
}

module.exports = { createContainer };
