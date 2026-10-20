const multer = require('multer');

const allowedMimeTypes = new Set(['image/jpeg', 'image/png', 'image/webp']);

function createImageUpload(maxFileSize = 5 * 1024 * 1024) {
  return multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: maxFileSize },
    fileFilter: (_request, file, callback) => {
      if (!allowedMimeTypes.has(file.mimetype)) {
        callback(new Error('Envie uma imagem JPG, PNG ou WebP.'));
        return;
      }

      callback(null, true);
    },
  });
}

const avatarUpload = createImageUpload();
const productImageUpload = createImageUpload(10 * 1024 * 1024);

module.exports = { avatarUpload, productImageUpload };
