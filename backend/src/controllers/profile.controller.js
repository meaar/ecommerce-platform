function createProfileController(profileService) {
  return {
    uploadAvatar: async (request, response) => {
      if (!request.file) {
        response.status(400).json({ message: 'Envie uma imagem JPG, PNG ou WebP.' });
        return;
      }

      response.json(await profileService.uploadAvatar(request.user, request.file));
    },

    getAvatar: async (request, response) => {
      let object;

      try {
        object = await profileService.getAvatar(request.params.userId);
      } catch (error) {
        if (error.name === 'NoSuchKey' || error.Code === 'NoSuchKey' || error.$metadata?.httpStatusCode === 404) {
          response.sendStatus(404);
          return;
        }

        throw error;
      }

      response.setHeader('Cache-Control', 'no-store, max-age=0');
      response.setHeader('Content-Type', object.ContentType || 'application/octet-stream');
      object.Body.pipe(response);
    },
  };
}

module.exports = { createProfileController };
