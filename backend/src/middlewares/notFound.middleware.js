/**
 * Middleware para requisições a rotas inexistentes.
 * Deve ser registrado logo APÓS as rotas e ANTES do errorHandler.
 */
function notFound(req, res, next) {
  res.status(404).json({
    success: false,
    error: {
      code: 'ROUTE_NOT_FOUND',
      message: `Rota ${req.method} ${req.originalUrl} não existe.`,
    },
  });
}

module.exports = notFound;
