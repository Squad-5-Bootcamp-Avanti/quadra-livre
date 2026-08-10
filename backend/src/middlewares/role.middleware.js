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
      return res.status(401).json({
        success: false,
        message: 'Usuário não autenticado.',
        code: 'UNAUTHENTICATED',
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Acesso negado. Você não tem permissão para esta ação.',
        code: 'FORBIDDEN',
      });
    }

    next();
  };
}

module.exports = { authorize };
