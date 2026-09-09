const multer = require('multer');

const allowedMimeTypes = new Set(['image/jpeg', 'image/png', 'image/webp']);

const avatarUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_request, file, callback) => {
    if (!allowedMimeTypes.has(file.mimetype)) {
      callback(new Error('Envie uma imagem JPG, PNG ou WebP.'));
      return;
    }

    callback(null, true);
  },
});

module.exports = { avatarUpload };
