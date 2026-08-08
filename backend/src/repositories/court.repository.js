const prisma = require('../config/database');

async function create(data) {
  return prisma.court.create({
    data,
  });
}

async function findAll() {
  return prisma.court.findMany();
}

async function findById(id) {
  return prisma.court.findUnique({
    where: { id },
  });
}

async function findByName(name) {
  return prisma.court.findFirst({
    where: { name },
  });
}

async function update(id, data) {
  return prisma.court.update({
    where: { id },
    data,
  });
}

async function deleteCourt(id) {
  return prisma.court.delete({
    where: { id },
  });
}

module.exports = {
  create,
  findAll,
  findById,
  findByName,
  update,
  delete: deleteCourt,
};