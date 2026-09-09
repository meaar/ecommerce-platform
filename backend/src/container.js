const { UserRepository } = require('./repositories/user.repository');
const { SessionRepository } = require('./repositories/session.repository');
const { AuthService } = require('./services/auth.service');
const { ProfileService } = require('./services/profile.service');
const { StorageService } = require('./services/storage.service');
const { createAuthController } = require('./controllers/auth.controller');
const { createProfileController } = require('./controllers/profile.controller');
const { createOrderController } = require('./controllers/order.controller');
const { env } = require('./config/env');

function createContainer() {
  const userRepository = new UserRepository(env.database);
  const sessionRepository = new SessionRepository(env.database);
  const storageService = new StorageService();
  const authService = new AuthService(userRepository, sessionRepository);
  const profileService = new ProfileService(userRepository, storageService);

  return {
    authController: createAuthController(authService, sessionRepository),
    profileController: createProfileController(profileService),
    orderController: createOrderController(),
    userRepository,
    sessionRepository,
  };
}

module.exports = { createContainer };
