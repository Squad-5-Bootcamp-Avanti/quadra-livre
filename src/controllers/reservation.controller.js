const reservationService = require('../services/reservation.service');
const asyncHandler = require('../utils/asyncHandler');
const { success } = require('../utils/httpResponse');

const create = asyncHandler(async (req, res) => {
  const reservation = await reservationService.create(req.body);

  return success(res, {
    data: reservation,
    message: 'Reserva criada com sucesso.',
    statusCode: 201,
  });
});

const list = asyncHandler(async (req, res) => {
  const reservations = await reservationService.findAll();

  return success(res, {
    data: reservations,
    message: 'Reservas listadas com sucesso.',
  });
});

const getById = asyncHandler(async (req, res) => {
  const reservation = await reservationService.findById(req.params.id);

  return success(res, {
    data: reservation,
    message: 'Reserva encontrada com sucesso.',
  });
});

const update = asyncHandler(async (req, res) => {
  const reservation = await reservationService.update(req.params.id, req.body);

  return success(res, {
    data: reservation,
    message: 'Reserva atualizada com sucesso.',
  });
});

const remove = asyncHandler(async (req, res) => {
  await reservationService.delete(req.params.id);

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