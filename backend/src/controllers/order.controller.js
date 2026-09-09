const crypto = require('node:crypto');

function createOrderController() {
  return {
    create: (request, response) => {
      const items = Array.isArray(request.body?.items) ? request.body.items : [];

      if (!items.length) {
        response.status(400).json({ message: 'O carrinho esta vazio.' });
        return;
      }

      const itemCount = items.reduce((total, item) => total + Number(item.quantity || 0), 0);
      response.status(201).json({
        orderId: crypto.randomUUID(),
        status: 'received',
        itemCount,
      });
    },
  };
}

module.exports = { createOrderController };
