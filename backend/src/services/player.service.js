const playerRepository = require('../repositories/player.repository');
const ApiError = require('../utils/ApiError');
const { parsePagination, buildMeta } = require('../utils/pagination');

async function create(data) {
  const existingPlayer = await playerRepository.findByEmail(data.email);

  if (existingPlayer) {
    throw ApiError.conflict('Já existe um jogador com este e-mail.', 'EMAIL_ALREADY_EXISTS');
  }

  return playerRepository.create(data);
}

async function findAll({ page, limit } = {}) {
  // Sem `page`/`limit` na query, mantém o comportamento original
  // (array completo, sem meta), preservando os consumidores atuais.
  if (page === undefined && limit === undefined) {
    return { data: await playerRepository.findAll() };
  }

  const pagination = parsePagination({ page, limit });
  const [players, total] = await playerRepository.findPage(pagination);

  return {
    data: players,
    meta: buildMeta({ total, page: pagination.page, limit: pagination.limit }),
  };
}

async function findById(id) {
  const player = await playerRepository.findById(id);

  if (!player) {
    throw ApiError.notFound('Jogador não encontrado.');
  }

  return player;
}

async function update(id, data) {
  const player = await playerRepository.findById(id);

  if (!player) {
    throw ApiError.notFound('Jogador não encontrado.');
  }

  if (data.email && data.email !== player.email) {
    const existingPlayer = await playerRepository.findByEmail(data.email);

    if (existingPlayer) {
      throw ApiError.conflict('Já existe um jogador com este e-mail.', 'EMAIL_ALREADY_EXISTS');
    }
  }

  return playerRepository.update(id, data);
}

async function deletePlayer(id) {
  const player = await playerRepository.findById(id);

  if (!player) {
    throw ApiError.notFound('Jogador não encontrado.');
  }

  return playerRepository.delete(id);
}

async function setStatus(id, isActive, requesterId) {
  // Admin não pode desativar a própria conta.
  if (!isActive && id === requesterId) {
    throw ApiError.badRequest('Você não pode desativar a própria conta.', 'CANNOT_DEACTIVATE_SELF');
  }

  const player = await playerRepository.findById(id);

  if (!player) {
    throw ApiError.notFound('Jogador não encontrado.');
  }

  return playerRepository.update(id, { isActive });
}

module.exports = {
  create,
  findAll,
  findById,
  update,
  delete: deletePlayer,
  setStatus,
};