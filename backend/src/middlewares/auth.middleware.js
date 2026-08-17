const jwt = require('jsonwebtoken');
const ApiError = require('../utils/ApiError');

/**
 * Middleware de autenticação.
 * Verifica se o token JWT está presente e é válido.
 * Injeta os dados do usuário em req.user para uso nas rotas.
 */
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(ApiError.unauthorized('Token de autenticação não fornecido.', 'MISSING_TOKEN'));
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, email, role }
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return next(ApiError.unauthorized('Token expirado. Faça login novamente.', 'TOKEN_EXPIRED'));
    }

    return next(ApiError.unauthorized('Token inválido.', 'INVALID_TOKEN'));
  }
}

module.exports = { authenticate };
