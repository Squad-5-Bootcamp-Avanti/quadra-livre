const prisma = require("../config/database");

async function create(data) {
  return prisma.reservation.create({
    data,
    include: {
      player: true,
      court: true,
    },
  });
}

async function findConflicts({ courtId, date, startTime, endTime, excludeId }) {
  return prisma.reservation.findMany({
    where: {
      courtId,
      date,

      startTime: {
        lt: endTime,
      },

      endTime: {
        gt: startTime,
      },

      ...(excludeId && {
        id: {
          not: excludeId,
        },
      }),
    },
  });
}

async function findAll(filters = {}) {
  return prisma.reservation.findMany({
    where: filters,
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
    include: {
      player: true,
      court: true,
    },
  });
}

async function remove(id) {
  return prisma.reservation.delete({
    where: { id },
  });
}

module.exports = {
  create,
  findConflicts,
  findAll,
  findById,
  update,
  remove,
};
