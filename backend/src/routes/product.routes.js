const express = require('express');
const { asyncHandler } = require('../utils/async-handler');
const { createRequireAuth } = require('../middlewares/auth.middleware');
const { productImageUpload } = require('../middlewares/upload.middleware');

function productRoutes({ productController, userRepository, sessionRepository }) {
  const router = express.Router();
  const requireAuth = createRequireAuth(userRepository, sessionRepository);

  router.get('/', asyncHandler(productController.list));
  router.get('/:id/image', asyncHandler(productController.getImage));
  router.get('/:id', asyncHandler(productController.getById));
  router.post('/:id/image', requireAuth, productImageUpload.single('image'), asyncHandler(productController.uploadImage));

  return router;
}

module.exports = { productRoutes };
