const prisma = require('../config/database');

async function create(data) {
  return prisma.reservation.create({
    data,
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
  });
}

async function deleteReservation(id) {
  return prisma.reservation.delete({
    where: { id },
  });
}

async function findConflicts({ courtId, date, startTime, endTime, excludeId }) {
  return prisma.reservation.findMany({
    where: {
      courtId,
      date,
      ...(excludeId && { id: { not: excludeId } }),
      AND: [
        { startTime: { lt: endTime } },
        { endTime: { gt: startTime } },
      ],
    },
  });
}

module.exports = {
  create,
  findAll,
  findById,
  update,
  remove: deleteReservation,
  findConflicts,
};