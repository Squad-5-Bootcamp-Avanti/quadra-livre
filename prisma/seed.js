/**
 * Script de seed — popula o banco com dados fictícios de exemplo,
 * para que qualquer pessoa que clone o projeto já tenha algo pra
 * testar sem precisar cadastrar tudo manualmente.
 *
 * Executar com: npx prisma db seed
 * (ou diretamente: node prisma/seed.js)
 */
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Helpers de conversão — mesma lógica usada no reservation.service.js,
// para manter os horários consistentes com o resto da aplicação.
function parseDateOnly(dateString) {
  return new Date(`${dateString}T00:00:00.000Z`);
}

function parseTimeOnly(timeString) {
  return new Date(`1970-01-01T${timeString}:00.000Z`);
}

function isoDate(date) {
  return date.toISOString().slice(0, 10);
}

function addDays(date, days) {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + days);
  return copy;
}

async function main() {
  const existingPlayers = await prisma.player.count();

  if (existingPlayers > 0) {
    console.log(
      'O banco já possui dados — o seed não foi executado, para evitar duplicar registros.\n' +
        'Se quiser popular do zero, limpe as tabelas antes (ex.: via `npx prisma db push --force-reset`).'
    );
    return;
  }

  // ── Jogadores fictícios ──────────────────────────────────────
  const [alberto, carol, joao, maria, fernanda] = await Promise.all([
    prisma.player.create({
      data: { name: 'Alberto Soares', email: 'alberto@exemplo.com', phone: '(81) 98989-5263' },
    }),
    prisma.player.create({
      data: { name: 'Carol Cavalcanti', email: 'carol@exemplo.com', phone: '(81) 98888-4321' },
    }),
    prisma.player.create({
      data: { name: 'João Alves', email: 'joao@exemplo.com', phone: '(81) 99999-1234' },
    }),
    prisma.player.create({
      data: { name: 'Maria Silva', email: 'maria@exemplo.com', phone: '(81) 98777-5566' },
    }),
    prisma.player.create({
      data: { name: 'Fernanda Ávila', email: 'fernanda@exemplo.com', phone: '(81) 99999-0000' },
    }),
  ]);

  // ── Quadras fictícias ─────────────────────────────────────────
  const [futsal, volei, tenis, basquete, society] = await Promise.all([
    prisma.court.create({
      data: { name: 'Quadra Futsal 01', sport: 'FUTSAL', location: 'Bloco A' },
    }),
    prisma.court.create({
      data: { name: 'Quadra Vôlei 01', sport: 'VOLLEYBALL', location: 'Bloco B' },
    }),
    prisma.court.create({
      data: { name: 'Quadra Tênis 01', sport: 'TENNIS', location: 'Bloco C' },
    }),
    prisma.court.create({
      data: { name: 'Quadra Basquete 01', sport: 'BASKETBALL', location: 'Bloco D' },
    }),
    prisma.court.create({
      data: { name: 'Campo Society', sport: 'SOCCER', location: 'Área externa' },
    }),
  ]);

  // ── Reservas fictícias (sem conflitos entre si) ────────────────
  const today = new Date();

  await prisma.reservation.createMany({
    data: [
      {
        playerId: alberto.id,
        courtId: futsal.id,
        date: parseDateOnly(isoDate(addDays(today, 1))),
        startTime: parseTimeOnly('10:00'),
        endTime: parseTimeOnly('11:00'),
      },
      {
        playerId: carol.id,
        courtId: volei.id,
        date: parseDateOnly(isoDate(addDays(today, 1))),
        startTime: parseTimeOnly('14:00'),
        endTime: parseTimeOnly('15:00'),
      },
      {
        playerId: joao.id,
        courtId: futsal.id,
        date: parseDateOnly(isoDate(addDays(today, 2))),
        startTime: parseTimeOnly('09:00'),
        endTime: parseTimeOnly('10:00'),
      },
      {
        playerId: maria.id,
        courtId: basquete.id,
        date: parseDateOnly(isoDate(today)),
        startTime: parseTimeOnly('18:00'),
        endTime: parseTimeOnly('19:30'),
      },
      {
        playerId: fernanda.id,
        courtId: tenis.id,
        date: parseDateOnly(isoDate(addDays(today, 3))),
        startTime: parseTimeOnly('16:00'),
        endTime: parseTimeOnly('17:00'),
      },
      {
        playerId: alberto.id,
        courtId: society.id,
        date: parseDateOnly(isoDate(addDays(today, 4))),
        startTime: parseTimeOnly('19:00'),
        endTime: parseTimeOnly('20:00'),
      },
    ],
  });

  console.log('✅ Seed concluído: 5 jogadores, 5 quadras e 6 reservas de exemplo criados.');
}

main()
  .catch((error) => {
    console.error('❌ Erro ao executar o seed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
