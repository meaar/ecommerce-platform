const crypto = require('node:crypto');

function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  return new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, 64, (error, derivedKey) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(`${salt}:${derivedKey.toString('hex')}`);
    });
  });
}

async function verifyPassword(password, storedHash) {
  const [salt, key] = storedHash.split(':');
  const hashedPassword = await hashPassword(password, salt);
  const storedKey = Buffer.from(key, 'hex');
  const calculatedKey = Buffer.from(hashedPassword.split(':')[1], 'hex');

  return storedKey.length === calculatedKey.length
    && crypto.timingSafeEqual(storedKey, calculatedKey);
}

module.exports = { hashPassword, verifyPassword };
