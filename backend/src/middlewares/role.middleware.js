const ApiError = require('../utils/ApiError');

/**
 * Middleware de autorização baseado em roles (RBAC).
 * Deve ser usado DEPOIS do middleware authenticate.
 *
 * Uso: router.post('/', authenticate, authorize('ADMIN'), controller.create)
 * Uso múltiplo: authorize('ADMIN', 'JOGADOR') — aceita qualquer um dos roles
 */
function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return next(ApiError.unauthorized('Usuário não autenticado.', 'UNAUTHENTICATED'));
    }

    if (!roles.includes(req.user.role)) {
      return next(ApiError.forbidden('Acesso negado. Você não tem permissão para esta ação.', 'FORBIDDEN'));
    }

    next();
  };
}

module.exports = { authorize };
