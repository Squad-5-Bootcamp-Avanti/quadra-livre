const prisma = require('../config/database');

async function getStats() {
  const [totalPlayers, totalCourts, totalReservations] = await prisma.$transaction([
    prisma.player.count(),
    prisma.court.count(),
    prisma.reservation.count(),
  ]);

  return { totalPlayers, totalCourts, totalReservations };
}

module.exports = {
  getStats,
};
