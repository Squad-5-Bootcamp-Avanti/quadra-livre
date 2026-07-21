const playerRepository = require('../repositories/player.repository');
const ApiError = require('../utils/ApiError');

async function create(data) {
  const existingPlayer = await playerRepository.findByEmail(data.email);

  if (existingPlayer) {
    throw ApiError.conflict('Já existe um jogador com este e-mail.', 'EMAIL_ALREADY_EXISTS');
  }

  return playerRepository.create(data);
}

async function findAll() {
  return playerRepository.findAll();
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

module.exports = {
  create,
  findAll,
  findById,
  update,
  delete: deletePlayer,
};