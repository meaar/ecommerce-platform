function createProductController(productRepository) {
  return {
    list: async (_request, response) => {
      response.json(await productRepository.findAll());
    },

    getById: async (request, response) => {
      const product = await productRepository.findById(request.params.id);

      if (!product) {
        response.status(404).json({ message: 'Produto nao encontrado.' });
        return;
      }

      response.json(product);
    },
  };
}

module.exports = { createProductController };
