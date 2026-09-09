function notFoundHandler(_request, response) {
  response.status(404).json({ message: 'Rota nao encontrada.' });
}

function errorHandler(error, _request, response, _next) {
  console.error(error);
  const isUploadValidationError = error instanceof Error && error.message === 'Envie uma imagem JPG, PNG ou WebP.';
  const statusCode = error.statusCode || (error.code === 'LIMIT_FILE_SIZE' ? 413 : isUploadValidationError ? 400 : 500);
  const message = statusCode === 500 ? 'Nao foi possivel concluir a operacao.' : error.message;
  response.status(statusCode).json({ message });
}

module.exports = { notFoundHandler, errorHandler };
