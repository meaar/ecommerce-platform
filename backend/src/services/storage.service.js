const { HeadBucketCommand, CreateBucketCommand, S3Client } = require('@aws-sdk/client-s3');
const { env } = require('../config/env');

class StorageService {
  constructor() {
    this.client = new S3Client({
      endpoint: env.rustfs.endpoint,
      region: env.rustfs.region,
      credentials: {
        accessKeyId: env.rustfs.accessKey,
        secretAccessKey: env.rustfs.secretKey,
      },
      forcePathStyle: true,
    });
    this.bucketReady = false;
  }

  async ensureBucket() {
    if (this.bucketReady) {
      return;
    }

    try {
      await this.client.send(new HeadBucketCommand({ Bucket: env.rustfs.bucket }));
    } catch (error) {
      const isMissingBucket = error.name === 'NotFound' || error.$metadata?.httpStatusCode === 404;

      if (!isMissingBucket) {
        throw error;
      }

      await this.client.send(new CreateBucketCommand({ Bucket: env.rustfs.bucket }));
    }

    this.bucketReady = true;
  }

  async putObject(command) {
    await this.ensureBucket();
    return this.client.send(command);
  }

  async getObject(command) {
    await this.ensureBucket();
    return this.client.send(command);
  }
}

module.exports = { StorageService };
