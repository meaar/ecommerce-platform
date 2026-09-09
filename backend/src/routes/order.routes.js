const express = require('express');
const { asyncHandler } = require('../utils/async-handler');
const { createRequireAuth } = require('../middlewares/auth.middleware');

function orderRoutes({ orderController, userRepository, sessionRepository }) {
	const router = express.Router();
	const requireAuth = createRequireAuth(userRepository, sessionRepository);

	router.post('/', requireAuth, asyncHandler(orderController.create));

	return router;
}

module.exports = { orderRoutes };
