const express = require('express');
const { asyncHandler } = require('../utils/async-handler');

function productRoutes({ productController }) {
  const router = express.Router();

  router.get('/', asyncHandler(productController.list));
  router.get('/:id', asyncHandler(productController.getById));

  return router;
}

module.exports = { productRoutes };
