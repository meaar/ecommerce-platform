function createProductController(productRepository, productService) {
  return {
    list: async (_request, response) => {
      const products = await productRepository.findAll();
      response.json(products.map(product => productService.toPublicProduct(product)));
    },

    getById: async (request, response) => {
      const product = await productRepository.findById(request.params.id);

      if (!product) {
        response.status(404).json({ message: 'Produto nao encontrado.' });
        return;
      }

      response.json(productService.toPublicProduct(product));
    },

    uploadImage: async (request, response) => {
      if (!request.file) {
        response.status(400).json({ message: 'Envie uma imagem JPG, PNG ou WebP.' });
        return;
      }

      response.json(await productService.uploadImage(request.params.id, request.file));
    },

    getImage: async (request, response) => {
      let object;
      try {
        object = await productService.getImage(request.params.id);
      } catch (error) {
        if (error.name === 'NoSuchKey' || error.Code === 'NoSuchKey' || error.$metadata?.httpStatusCode === 404) {
          response.sendStatus(404);
          return;
        }
        throw error;
      }

      response.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      response.setHeader('Content-Type', object.ContentType || 'application/octet-stream');
      object.Body.pipe(response);
    },
  };
}

module.exports = { createProductController };
