const prisma = require("../config/database");

// O player embutido sai sem o hash de `password`.
const reservationInclude = {
  player: {
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
    },
  },
  court: true,
};

const reservationOrder = [{ date: "desc" }, { startTime: "desc" }];

async function create(data) {
  return prisma.reservation.create({
    data,
  });
}

async function findAll(filters = {}) {
  return prisma.reservation.findMany({
    where: filters,
    include: reservationInclude,
    orderBy: reservationOrder,
  });
}

async function findPage(filters = {}, { skip, take }) {
  return prisma.$transaction([
    prisma.reservation.findMany({
      where: filters,
      include: reservationInclude,
      orderBy: reservationOrder,
      skip,
      take,
    }),
    prisma.reservation.count({ where: filters }),
  ]);
}

async function findById(id) {
  return prisma.reservation.findUnique({
    where: { id },
    include: reservationInclude,
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
      AND: [{ startTime: { lt: endTime } }, { endTime: { gt: startTime } }],
    },
  });
}

module.exports = {
  create,
  findAll,
  findPage,
  findById,
  update,
  remove: deleteReservation,
  findConflicts,
};
