const playerService = require('../services/player.service');
const asyncHandler = require('../utils/asyncHandler');
const { success } = require('../utils/httpResponse');
const ApiError = require('../utils/ApiError');

const create = asyncHandler(async (req, res) => {
  const player = await playerService.create(req.body);

  return success(res, {
    data: player,
    message: 'Jogador criado com sucesso.',
    statusCode: 201,
  });
});

const list = asyncHandler(async (req, res) => {
  const { page, limit } = req.query;
  const result = await playerService.findAll({ page, limit });

  return success(res, {
    data: result.data,
    meta: result.meta,
    message: 'Jogadores listados com sucesso.',
  });
});

const getById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (req.user.role !== 'ADMIN' && req.user.id !== id) {
    throw ApiError.forbidden('Você não tem permissão para visualizar este perfil.');
  }

  const player = await playerService.findById(id);

  return success(res, {
    data: player,
    message: 'Jogador encontrado com sucesso.',
  });
});

const update = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (req.user.role !== 'ADMIN' && req.user.id !== id) {
    throw ApiError.forbidden('Você não tem permissão para editar este perfil.');
  }

  // Whitelist de campos: impede que role, senha ou outros campos sensíveis
  // sejam alterados através deste endpoint.
  const { name, email, phone } = req.body;
  const player = await playerService.update(id, { name, email, phone });

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
