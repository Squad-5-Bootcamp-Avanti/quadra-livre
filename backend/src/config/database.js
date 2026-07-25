const { PrismaClient } = require('@prisma/client');

// Instância única do PrismaClient (padrão Singleton).
// Evita esgotar o pool de conexões do PostgreSQL ao criar
// um novo client a cada requisição/import.
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
});

module.exports = prisma;
