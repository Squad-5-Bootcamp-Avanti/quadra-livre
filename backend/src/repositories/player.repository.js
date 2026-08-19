const prisma = require('../config/database');

// Campos expostos nas respostas: o hash de `password` nunca sai daqui.
const publicPlayerSelect = {
  id: true,
  name: true,
  email: true,
  phone: true,
  role: true,
  createdAt: true,
  updatedAt: true,
};

async function create(data) {
  return prisma.player.create({
    data,
    select: publicPlayerSelect,
  });
}

async function findAll() {
  return prisma.player.findMany({
    select: publicPlayerSelect,
    orderBy: { name: 'asc' },
  });
}

async function findPage({ skip, take }) {
  return prisma.$transaction([
    prisma.player.findMany({
      select: publicPlayerSelect,
      orderBy: { name: 'asc' },
      skip,
      take,
    }),
    prisma.player.count(),
  ]);
}

async function findById(id) {
  return prisma.player.findUnique({
    where: { id },
    select: publicPlayerSelect,
  });
}

async function findByEmail(email) {
  return prisma.player.findUnique({
    where: { email },
    select: publicPlayerSelect,
  });
}

async function update(id, data) {
  return prisma.player.update({
    where: { id },
    data,
    select: publicPlayerSelect,
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
  findPage,
  findById,
  findByEmail,
  update,
  delete: deletePlayer,
};
