const express = require('express');
const { asyncHandler } = require('../utils/async-handler');
const { createRequireAuth } = require('../middlewares/auth.middleware');
const { avatarUpload } = require('../middlewares/upload.middleware');

function profileRoutes({ profileController, userRepository, sessionRepository }) {
	const router = express.Router();
	const requireAuth = createRequireAuth(userRepository, sessionRepository);

	router.post('/avatar', requireAuth, avatarUpload.single('avatar'), asyncHandler(profileController.uploadAvatar));
	router.get('/avatar/:userId', asyncHandler(profileController.getAvatar));

	return router;
}

module.exports = { profileRoutes };
