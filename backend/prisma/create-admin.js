/**
 * Script para criar o primeiro usuário ADMIN do sistema.
 * Execute com: node prisma/create-admin.js
 */
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@quadralivre.com';

  const existing = await prisma.player.findUnique({ where: { email } });

  if (existing) {
    // Atualiza para ADMIN caso já exista
    const updated = await prisma.player.update({
      where: { email },
      data: {
        role: 'ADMIN',
        password: await bcrypt.hash('admin123', 12),
      },
    });
    console.log(`✅ Usuário existente promovido para ADMIN: ${updated.email}`);
    return;
  }

  const admin = await prisma.player.create({
    data: {
      name: 'Admin Quadra Livre',
      email,
      phone: '81999999999',
      password: await bcrypt.hash('admin123', 12),
      role: 'ADMIN',
    },
  });

  console.log(`✅ Admin criado com sucesso!`);
  console.log(`   Email: ${admin.email}`);
  console.log(`   Senha: admin123`);
  console.log(`   Role:  ${admin.role}`);
}

main()
  .catch((e) => {
    console.error('❌ Erro ao criar admin:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
