const crypto = require('node:crypto');
const path = require('node:path');
const { PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const { env } = require('../config/env');

class ProductService {
  constructor(productRepository, objectStorage) {
    this.productRepository = productRepository;
    this.objectStorage = objectStorage;
  }

  async uploadImage(productId, file) {
    const product = await this.productRepository.findById(productId);
    if (!product) {
      const error = new Error('Produto nao encontrado.');
      error.statusCode = 404;
      throw error;
    }

    const extension = path.extname(file.originalname).toLowerCase() || `.${file.mimetype.split('/')[1]}`;
    const key = `${productId}/${crypto.randomUUID()}${extension === '.jpeg' ? '.jpg' : extension}`;

    await this.objectStorage.putObject(new PutObjectCommand({
      Bucket: env.rustfs.buckets.products,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    }));

    const updatedProduct = await this.productRepository.updateImageKey(productId, key);
    return this.toPublicProduct(updatedProduct);
  }

  async getImage(productId) {
    const product = await this.productRepository.findById(productId);
    if (!product?.imageKey) {
      const error = new Error('Imagem do produto nao encontrada.');
      error.statusCode = 404;
      throw error;
    }

    return this.objectStorage.getObject(new GetObjectCommand({
      Bucket: env.rustfs.buckets.products,
      Key: product.imageKey,
    }));
  }

  toPublicProduct(product) {
    return {
      ...product,
      image: product.imageKey ? `/api/products/${encodeURIComponent(product.id)}/image` : product.image,
      imageFallback: product.image,
    };
  }
}

module.exports = { ProductService };
