const { Router } = require('express');
const playerRoutes = require('./player.routes');
const courtRoutes = require('./court.routes');
const reservationRoutes = require('./reservation.routes');
const authRoutes = require('./auth.routes');
const adminRoutes = require('./admin.routes');

const router = Router();

// Health-check
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API rodando normalmente.',
    data: { timestamp: new Date().toISOString() },
  });
});

// Autenticação (rotas públicas)
router.use('/auth', authRoutes);

// Recursos
router.use('/players', playerRoutes);
router.use('/courts', courtRoutes);
router.use('/reservations', reservationRoutes);
router.use('/admin', adminRoutes);

module.exports = router;
