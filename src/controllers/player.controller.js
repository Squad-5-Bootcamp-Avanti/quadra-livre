const playerService = require('../services/player.service');
const asyncHandler = require('../utils/asyncHandler');
const { success } = require('../utils/httpResponse');

const create = asyncHandler(async (req, res) => {
  const player = await playerService.create(req.body);

  return success(res, {
    data: player,
    message: 'Jogador criado com sucesso.',
    statusCode: 201,
  });
});

const list = asyncHandler(async (req, res) => {
  const players = await playerService.findAll();

  return success(res, {
    data: players,
    message: 'Jogadores listados com sucesso.',
  });
});

const getById = asyncHandler(async (req, res) => {
  const player = await playerService.findById(req.params.id);

  return success(res, {
    data: player,
    message: 'Jogador encontrado com sucesso.',
  });
});

const update = asyncHandler(async (req, res) => {
  const player = await playerService.update(req.params.id, req.body);

  return success(res, {
    data: player,
    message: 'Jogador atualizado com sucesso.',
  });
});

const remove = asyncHandler(async (req, res) => {
  await playerService.delete(req.params.id);

  return success(res, {
    data: null,
    message: 'Jogador removido com sucesso.',
  });
});

module.exports = {
  create,
  list,
  getById,
  update,
  remove,
};