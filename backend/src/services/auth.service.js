const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authRepository = require('../repositories/auth.repository');
const ApiError = require('../utils/ApiError');

const SALT_ROUNDS = 12;
const TOKEN_EXPIRY = '7d';

/**
 * Gera um JWT assinado com as informações públicas do usuário.
 */
function generateToken(player) {
  return jwt.sign(
    {
      id: player.id,
      email: player.email,
      role: player.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: TOKEN_EXPIRY }
  );
}

/**
 * Formata o retorno do usuário sem expor dados sensíveis.
 */
function formatPlayer(player) {
  return {
    id: player.id,
    name: player.name,
    email: player.email,
    phone: player.phone,
    role: player.role,
  };
}

/**
 * Registra um novo jogador com senha criptografada.
 * Por padrão, todo usuário criado pelo endpoint público
 * recebe o role JOGADOR.
 */
async function register(data) {
  const { name, email, phone, password } = data;

  const existing = await authRepository.findByEmail(email);
  if (existing) {
    throw ApiError.conflict('Já existe um usuário com este e-mail.', 'EMAIL_ALREADY_EXISTS');
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  const player = await authRepository.createUser({
    name,
    email,
    phone,
    password: hashedPassword,
    role: 'JOGADOR',
  });

  const token = generateToken(player);

  return { player: formatPlayer(player), token };
}

/**
 * Autentica um usuário validando e-mail e senha.
 * Retorna o token JWT e os dados públicos do usuário.
 */
async function login(email, password) {
  const player = await authRepository.findByEmail(email);

  if (!player || !player.password) {
    throw ApiError.badRequest('E-mail ou senha inválidos.', 'INVALID_CREDENTIALS');
  }

  const passwordMatch = await bcrypt.compare(password, player.password);

  if (!passwordMatch) {
    throw ApiError.badRequest('E-mail ou senha inválidos.', 'INVALID_CREDENTIALS');
  }

  const token = generateToken(player);

  return { player: formatPlayer(player), token };
}

/**
 * Promove um jogador para ADMIN ou rebaixa para JOGADOR.
 */
async function updateRole(id, role) {
  const validRoles = ['ADMIN', 'JOGADOR'];
  if (!validRoles.includes(role)) {
    throw ApiError.badRequest('Role inválido. Use ADMIN ou JOGADOR.', 'INVALID_ROLE');
  }

  return authRepository.updateRole(id, role);
}

module.exports = {
  register,
  login,
  updateRole,
};
