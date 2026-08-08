const prisma = require('../config/database');

/**
 * Busca um jogador pelo e-mail, incluindo o campo password.
 * Usado exclusivamente pela camada de autenticação.
 */
async function findByEmail(email) {
  return prisma.player.findUnique({
    where: { email },
  });
}

/**
 * Cria um novo jogador com senha e role já definidos.
 * Retorna o jogador sem o campo password.
 */
async function createUser(data) {
  return prisma.player.create({
    data,
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      createdAt: true,
    },
  });
}

/**
 * Atualiza o role de um jogador (promover/rebaixar).
 */
async function updateRole(id, role) {
  return prisma.player.update({
    where: { id },
    data: { role },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });
}

module.exports = {
  findByEmail,
  createUser,
  updateRole,
};
