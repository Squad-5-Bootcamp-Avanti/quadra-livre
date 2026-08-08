const authService = require('../services/auth.service');
const asyncHandler = require('../utils/asyncHandler');
const { success } = require('../utils/httpResponse');

/**
 * POST /api/auth/register
 * Cadastra um novo jogador e retorna o token JWT.
 */
const register = asyncHandler(async (req, res) => {
  const { name, email, phone, password } = req.body;

  if (!name || !email || !phone || !password) {
    return res.status(400).json({
      success: false,
      message: 'Campos obrigatórios: name, email, phone, password.',
      code: 'MISSING_FIELDS',
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'A senha deve ter no mínimo 6 caracteres.',
      code: 'WEAK_PASSWORD',
    });
  }

  const result = await authService.register({ name, email, phone, password });

  return success(res, {
    data: result,
    message: 'Usuário cadastrado com sucesso.',
    statusCode: 201,
  });
});

/**
 * POST /api/auth/login
 * Autentica o usuário e retorna o token JWT.
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Campos obrigatórios: email, password.',
      code: 'MISSING_FIELDS',
    });
  }

  const result = await authService.login(email, password);

  return success(res, {
    data: result,
    message: 'Login realizado com sucesso.',
  });
});

/**
 * PATCH /api/auth/users/:id/role
 * Promove ou rebaixa um usuário (apenas ADMIN).
 */
const updateRole = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  if (!role) {
    return res.status(400).json({
      success: false,
      message: 'Campo obrigatório: role.',
      code: 'MISSING_FIELDS',
    });
  }

  const player = await authService.updateRole(id, role);

  return success(res, {
    data: player,
    message: `Usuário atualizado para ${role} com sucesso.`,
  });
});

module.exports = {
  register,
  login,
  updateRole,
};
