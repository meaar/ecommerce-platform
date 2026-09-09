const crypto = require('node:crypto');
const path = require('node:path');
const { PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const { env } = require('../config/env');
const { toPublicUser } = require('../utils/user');

class ProfileService {
  constructor(userRepository, objectStorage) {
    this.userRepository = userRepository;
    this.objectStorage = objectStorage;
  }

  async uploadAvatar(user, file) {
    const extension = path.extname(file.originalname).toLowerCase() || `.${file.mimetype.split('/')[1]}`;
    const key = `avatars/${user.id}/${crypto.randomUUID()}${extension === '.jpeg' ? '.jpg' : extension}`;

    await this.objectStorage.putObject(new PutObjectCommand({
      Bucket: env.rustfs.bucket,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    }));

    const updatedUser = await this.userRepository.update(user.id, { avatarKey: key });
    return {
      user: toPublicUser(updatedUser),
      avatarUrl: `/api/profile/avatar/${encodeURIComponent(user.id)}`,
    };
  }

  async getAvatar(userId) {
    const user = await this.userRepository.findById(userId);

    if (!user?.avatarKey) {
      const error = new Error('Foto de perfil nao encontrada.');
      error.statusCode = 404;
      throw error;
    }

    return this.objectStorage.getObject(new GetObjectCommand({
      Bucket: env.rustfs.bucket,
      Key: user.avatarKey,
    }));
  }
}

module.exports = { ProfileService };
