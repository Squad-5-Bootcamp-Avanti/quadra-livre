const { Router } = require('express');
const authController = require('../controllers/auth.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');

const router = Router();

// Rotas públicas — não exigem token
router.post('/register', authController.register);
router.post('/login', authController.login);

// Rota protegida — apenas ADMIN pode alterar roles
router.patch(
  '/users/:id/role',
  authenticate,
  authorize('ADMIN'),
  authController.updateRole
);

module.exports = router;
