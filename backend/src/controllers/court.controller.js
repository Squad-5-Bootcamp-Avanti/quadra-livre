const courtService = require('../services/court.service');
const asyncHandler = require('../utils/asyncHandler');
const { success } = require('../utils/httpResponse');

const create = asyncHandler(async (req, res) => {
  const court = await courtService.create(req.body);

  return success(res, {
    data: court,
    message: 'Quadra criada com sucesso.',
    statusCode: 201,
  });
});

const list = asyncHandler(async (req, res) => {
  const courts = await courtService.findAll();

  return success(res, {
    data: courts,
    message: 'Quadras listadas com sucesso.',
  });
});

const getById = asyncHandler(async (req, res) => {
  const court = await courtService.findById(req.params.id);

  return success(res, {
    data: court,
    message: 'Quadra encontrada com sucesso.',
  });
});

const update = asyncHandler(async (req, res) => {
  const court = await courtService.update(req.params.id, req.body);

  return success(res, {
    data: court,
    message: 'Quadra atualizada com sucesso.',
  });
});

const remove = asyncHandler(async (req, res) => {
  await courtService.delete(req.params.id);

  return success(res, {
    data: null,
    message: 'Quadra removida com sucesso.',
  });
});

module.exports = {
  create,
  list,
  getById,
  update,
  remove,
};