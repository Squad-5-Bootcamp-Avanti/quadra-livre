const { Router } = require('express');
const adminController = require('../controllers/admin.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');

const router = Router();

// Estatísticas agregadas do painel, apenas ADMIN
router.get('/stats', authenticate, authorize('ADMIN'), adminController.stats);

module.exports = router;
