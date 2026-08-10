const jwt = require('jsonwebtoken');

/**
 * Middleware de autenticação.
 * Verifica se o token JWT está presente e é válido.
 * Injeta os dados do usuário em req.user para uso nas rotas.
 */
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Token de autenticação não fornecido.',
      code: 'MISSING_TOKEN',
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, email, role }
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expirado. Faça login novamente.',
        code: 'TOKEN_EXPIRED',
      });
    }

    return res.status(401).json({
      success: false,
      message: 'Token inválido.',
      code: 'INVALID_TOKEN',
    });
  }
}

module.exports = { authenticate };
