const { Router } = require('express');
const playerRoutes = require('./player.routes');
const courtRoutes = require('./court.routes');
const reservationRoutes = require('./reservation.routes');


const router = Router();

// Health-check — confirma que a API está no ar e a estrutura de
// rotas está funcionando. Útil como primeiro teste de qualquer
// pessoa que acabou de clonar o projeto.
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API rodando normalmente.',
    data: { timestamp: new Date().toISOString() },
  });
});

// ────────────────────────────────────────────────────────────────
// A partir daqui, cada responsável registra suas rotas.
// Sigam o padrão: crie `<entidade>.routes.js` dentro de `src/routes/`,
// importe aqui, e registre com `router.use('/<entidade>', ...)`.
//
// Exemplo (Players — responsabilidade de quem pegou o CRUD de Jogadores):
// const playerRoutes = require('./player.routes');
// router.use('/players', playerRoutes);
//
// Exemplo (Courts — responsabilidade de quem pegou o CRUD de Quadras):
// const courtRoutes = require('./court.routes');
// router.use('/courts', courtRoutes);
//
// Exemplo (Reservations — responsabilidade de quem pegou o CRUD de Reservas):
// const reservationRoutes = require('./reservation.routes');
// router.use('/reservations', reservationRoutes);
// ────────────────────────────────────────────────────────────────

router.use('/players', playerRoutes);
router.use('/courts', courtRoutes);
router.use('/reservations', reservationRoutes);

module.exports = router;