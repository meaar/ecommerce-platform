const crypto = require('node:crypto');

function createSessionToken() {
  return crypto.randomBytes(32).toString('base64url');
}

function hashSessionToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

module.exports = { createSessionToken, hashSessionToken };
