const crypto = require('node:crypto');
const { hashPassword, verifyPassword } = require('../utils/password');
const { createSessionToken } = require('../utils/session');
const { toPublicUser } = require('../utils/user');
const { env } = require('../config/env');

class AuthService {
  constructor(userRepository, sessionRepository) {
    this.userRepository = userRepository;
    this.sessionRepository = sessionRepository;
  }

  async register({ name, email, password }) {
    const normalizedEmail = email.toLowerCase();
    const existingUser = await this.userRepository.findByEmail(normalizedEmail);

    if (existingUser) {
      const error = new Error('Este email ja esta cadastrado.');
      error.statusCode = 409;
      throw error;
    }

    const user = await this.userRepository.create({
      id: crypto.randomUUID(),
      name: name.trim(),
      email: normalizedEmail,
      passwordHash: await hashPassword(password),
      avatarKey: null,
      createdAt: new Date().toISOString(),
    });

    return this.createAuthResponse(user);
  }

  async login({ email, password }) {
    const user = await this.userRepository.findByEmail(email);
    const isPasswordValid = user && await verifyPassword(password, user.passwordHash);

    if (!isPasswordValid) {
      const error = new Error('Email ou senha invalidos.');
      error.statusCode = 401;
      throw error;
    }

    return this.createAuthResponse(user);
  }

  async createAuthResponse(user) {
    const token = createSessionToken();
    await this.sessionRepository.create({
      id: crypto.randomUUID(),
      userId: user.id,
      token,
      expiresAt: new Date(Date.now() + env.session.maxAgeMs),
    });

    return { token, user: toPublicUser(user) };
  }
}

module.exports = { AuthService };
