const { toPublicUser } = require('../utils/user');
const { env } = require('../config/env');
const { getSessionToken } = require('../middlewares/auth.middleware');

function sessionCookie(token) {
  const attributes = [
    `${env.session.cookieName}=${token}`,
    'Path=/',
    `Max-Age=${Math.floor(env.session.maxAgeMs / 1000)}`,
    'HttpOnly',
    'SameSite=Lax',
  ];

  if (env.session.secureCookie) {
    attributes.push('Secure');
  }

  return attributes.join('; ');
}

function expiredSessionCookie() {
  return `${env.session.cookieName}=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax`;
}

function createAuthController(authService, sessionRepository) {
  return {
    register: async (request, response) => {
      const { name, email, password } = request.body || {};

      if (!name?.trim() || name.trim().length > 120 || !/^\S+@\S+\.\S+$/.test(email || '') || String(email).length > 320 || typeof password !== 'string' || password.length < 8 || password.length > 128) {
        response.status(400).json({ message: 'Informe nome, email valido e senha com pelo menos 8 caracteres.' });
        return;
      }

      const authResponse = await authService.register({ name, email, password });
      response.setHeader('Set-Cookie', sessionCookie(authResponse.token));
      response.status(201).json({ user: authResponse.user });
    },

    login: async (request, response) => {
      const { email, password } = request.body || {};

      if (typeof email !== 'string' || typeof password !== 'string' || email.length > 320 || password.length > 128) {
        response.status(401).json({ message: 'Email ou senha invalidos.' });
        return;
      }

      const authResponse = await authService.login({ email: String(email || '').toLowerCase(), password: password || '' });
      response.setHeader('Set-Cookie', sessionCookie(authResponse.token));
      response.json({ user: authResponse.user });
    },

    me: async (request, response) => {
      response.json({ user: toPublicUser(request.user) });
    },

    logout: async (request, response) => {
      const token = getSessionToken(request);

      if (token) {
        await sessionRepository.deleteByToken(token);
      }

      response.setHeader('Set-Cookie', expiredSessionCookie());
      response.sendStatus(204);
    },
  };
}

module.exports = { createAuthController };
