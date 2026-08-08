const { Router } = require('express');
const { body } = require('express-validator');
const validate = require('../middlewares/validate.middleware');
const reservationController = require('../controllers/reservation.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');

const router = Router();

const reservationValidation = [
  body('playerId').notEmpty().withMessage('O jogador é obrigatório.'),
  body('courtId').notEmpty().withMessage('A quadra é obrigatória.'),
  body('date').notEmpty().withMessage('A data é obrigatória.'),
  body('startTime').notEmpty().withMessage('O horário inicial é obrigatório.'),
  body('endTime').notEmpty().withMessage('O horário final é obrigatório.'),
];

// ADMIN vê todas as reservas — JOGADOR vê apenas as suas (lógica no controller)
router.get('/', authenticate, reservationController.list);
router.get('/:id', authenticate, reservationController.getById);

// Qualquer usuário autenticado pode criar reserva
router.post('/', authenticate, reservationValidation, validate, reservationController.create);

// ADMIN edita qualquer reserva — JOGADOR cancela apenas as suas (lógica no controller)
router.put('/:id', authenticate, reservationValidation, validate, reservationController.update);
router.delete('/:id', authenticate, reservationController.remove);

module.exports = router;
