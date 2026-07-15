const ApiError = require('../utils/ApiError');

/**
 * Middleware global de tratamento de erros.
 * Deve ser o ÚLTIMO middleware registrado no server.js.
 *
 * - Erros operacionais (ApiError) são retornados com o
 *   statusCode/code/message definidos na origem.
 * - Erros inesperados (bugs, falhas de driver etc.) são
 *   logados no servidor e retornados como 500 genérico,
 *   sem vazar detalhes internos para o cliente.
 */
function errorHandler(err, req, res, next) {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
      },
    });
  }

  // Erro do Prisma: violação de constraint única (ex.: email duplicado)
  if (err.code === 'P2002') {
    return res.status(409).json({
      success: false,
      error: {
        code: 'UNIQUE_CONSTRAINT_VIOLATION',
        message: `Já existe um registro com o valor informado para: ${err.meta?.target}`,
      },
    });
  }

  // Erro do Prisma: registro não encontrado em update/delete
  if (err.code === 'P2025') {
    return res.status(404).json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: 'Registro não encontrado.',
      },
    });
  }

  console.error('[UNEXPECTED ERROR]', err);

  return res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: 'Erro interno do servidor.',
    },
  });
}

module.exports = errorHandler;
