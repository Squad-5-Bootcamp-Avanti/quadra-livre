const courtRepository = require('../repositories/court.repository');
const ApiError = require('../utils/ApiError');

async function create(data) {
  const existingCourt = await courtRepository.findByName(data.name);

  if (existingCourt) {
    throw ApiError.conflict('Já existe uma quadra com este nome.', 'COURT_NAME_ALREADY_EXISTS');
  }

  return courtRepository.create(data);
}

async function findAll() {
  return courtRepository.findAll();
}

async function findById(id) {
  const court = await courtRepository.findById(id);

  if (!court) {
    throw ApiError.notFound('Quadra não encontrada.');
  }

  return court;
}

async function update(id, data) {
  const court = await courtRepository.findById(id);

  if (!court) {
    throw ApiError.notFound('Quadra não encontrada.');
  }

  if (data.name && data.name !== court.name) {
    const existingCourt = await courtRepository.findByName(data.name);

    if (existingCourt) {
      throw ApiError.conflict('Já existe uma quadra com este nome.', 'COURT_NAME_ALREADY_EXISTS');
    }
  }

  return courtRepository.update(id, data);
}

async function deleteCourt(id) {
  const court = await courtRepository.findById(id);

  if (!court) {
    throw ApiError.notFound('Quadra não encontrada.');
  }

  return courtRepository.delete(id);
}

module.exports = {
  create,
  findAll,
  findById,
  update,
  delete: deleteCourt,
};