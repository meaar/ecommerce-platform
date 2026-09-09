const { env } = require('../config/env');

function getSessionToken(request) {
  return request.headers.cookie
    ?.split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${env.session.cookieName}=`))
    ?.slice(env.session.cookieName.length + 1);
}

function createRequireAuth(userRepository, sessionRepository) {
  return async function requireAuth(request, response, next) {
    try {
      const token = getSessionToken(request);
      const userId = token && await sessionRepository.findUserIdByToken(token);
      const user = userId && await userRepository.findById(userId);

      if (!user) {
        response.status(401).json({ message: 'Sessao expirada. Faca login novamente.' });
        return;
      }

      request.user = user;
      next();
    } catch (error) {
      next(error);
    }
  };
}

module.exports = { createRequireAuth, getSessionToken };
