const express = require('express');
const { asyncHandler } = require('../utils/async-handler');
const { createRequireAuth } = require('../middlewares/auth.middleware');
const { createRateLimiter } = require('../middlewares/rate-limit.middleware');

const authRateLimiter = createRateLimiter({ windowMs: 15 * 60 * 1000, maxRequests: 20 });

function authRoutes({ authController, userRepository, sessionRepository }) {
	const router = express.Router();
	const requireAuth = createRequireAuth(userRepository, sessionRepository);

	router.post('/register', authRateLimiter, asyncHandler(authController.register));
	router.post('/login', authRateLimiter, asyncHandler(authController.login));
	router.get('/me', requireAuth, asyncHandler(authController.me));
	router.post('/logout', asyncHandler(authController.logout));

	return router;
}

module.exports = { authRoutes };
