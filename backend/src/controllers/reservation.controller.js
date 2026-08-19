const reservationService = require('../services/reservation.service');
const asyncHandler = require('../utils/asyncHandler');
const { success } = require('../utils/httpResponse');
const ApiError = require('../utils/ApiError');

const create = asyncHandler(async (req, res) => {
  const reservation = await reservationService.create(req.body);

  return success(res, {
    data: reservation,
    message: 'Reserva criada com sucesso.',
    statusCode: 201,
  });
});

const list = asyncHandler(async (req, res) => {
  const filters = { ...req.query };

  // JOGADOR só pode listar as próprias reservas; ADMIN pode listar de
  // todos os jogadores ou filtrar por um playerId específico.
  if (req.user.role !== 'ADMIN') {
    filters.playerId = req.user.id;
  }

  const result = await reservationService.list(filters);

  return success(res, {
    data: result.data,
    meta: result.meta,
    message: 'Reservas listadas com sucesso.',
  });
});

const getById = asyncHandler(async (req, res) => {
  const reservation = await reservationService.getById(req.params.id);

  if (req.user.role !== 'ADMIN' && reservation.playerId !== req.user.id) {
    throw ApiError.forbidden('Você não tem permissão para visualizar esta reserva.');
  }

  return success(res, {
    data: reservation,
    message: 'Reserva encontrada com sucesso.',
  });
});

const update = asyncHandler(async (req, res) => {
  const existing = await reservationService.getById(req.params.id);

  if (req.user.role !== 'ADMIN' && existing.playerId !== req.user.id) {
    throw ApiError.forbidden('Você não tem permissão para editar esta reserva.');
  }

  // Apenas ADMIN pode reatribuir a reserva a outro jogador.
  const payload = req.user.role === 'ADMIN'
    ? req.body
    : { ...req.body, playerId: existing.playerId };

  const reservation = await reservationService.update(req.params.id, payload);

  return success(res, {
    data: reservation,
    message: 'Reserva atualizada com sucesso.',
  });
});

const remove = asyncHandler(async (req, res) => {
  const existing = await reservationService.getById(req.params.id);

  if (req.user.role !== 'ADMIN' && existing.playerId !== req.user.id) {
    throw ApiError.forbidden('Você não tem permissão para cancelar esta reserva.');
  }

  await reservationService.remove(req.params.id);

  return success(res, {
    data: null,
    message: 'Reserva removida com sucesso.',
  });
});

module.exports = {
  create,
  list,
  getById,
  update,
  remove,
};
