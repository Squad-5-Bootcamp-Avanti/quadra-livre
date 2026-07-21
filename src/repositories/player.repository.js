const prisma = require('../config/database');

async function create(data) {
  return prisma.player.create({
    data,
  });
}

module.exports = {
  create,
};

async function findAll() {
  return prisma.player.findMany();
}

async function findById(id) {
  return prisma.player.findUnique({
    where: { id },
  });
}

async function findByEmail(email) {
  return prisma.player.findUnique({
    where: { email },
  });
}

async function update(id, data) {
  return prisma.player.update({
    where: { id },
    data,
  });
}

async function deletePlayer(id) {
  return prisma.player.delete({
    where: { id },
  });
}

module.exports = {
  create,
  findAll,
  findById,
  findByEmail,
  update,
  delete: deletePlayer,
};