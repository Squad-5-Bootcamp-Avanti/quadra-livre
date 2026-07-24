const prisma = require('../config/database');

async function create(data) {
  return prisma.reservation.create({
    data,
  });
}

async function findAll() {
  return prisma.reservation.findMany({
    include: {
      player: true,
      court: true,
    },
  });
}

async function findById(id) {
  return prisma.reservation.findUnique({
    where: { id },
    include: {
      player: true,
      court: true,
    },
  });
}

async function update(id, data) {
  return prisma.reservation.update({
    where: { id },
    data,
  });
}

async function deleteReservation(id) {
  return prisma.reservation.delete({
    where: { id },
  });
}

module.exports = {
  create,
  findAll,
  findById,
  update,
  delete: deleteReservation,
};