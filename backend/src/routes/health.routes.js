const express = require('express');

const healthRoutes = express.Router();

healthRoutes.get('/', (_request, response) => {
  response.json({ ok: true });
});

module.exports = { healthRoutes };
