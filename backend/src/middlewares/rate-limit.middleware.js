function createRateLimiter({ windowMs, maxRequests }) {
  const attempts = new Map();

  return (request, response, next) => {
    const key = request.ip || request.socket.remoteAddress || 'unknown';
    const now = Date.now();
    const current = attempts.get(key);

    if (!current || current.expiresAt <= now) {
      attempts.set(key, { count: 1, expiresAt: now + windowMs });
      next();
      return;
    }

    if (current.count >= maxRequests) {
      response.status(429).json({ message: 'Muitas tentativas. Aguarde alguns minutos.' });
      return;
    }

    current.count += 1;
    next();
  };
}

module.exports = { createRateLimiter };
