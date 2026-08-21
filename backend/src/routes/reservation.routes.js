const { Router } = require('express');
const { body } = require('express-validator');
const validate = require('../middlewares/validate.middleware');
const reservationController = require('../controllers/reservation.controller');
const { authenticate } = require('../middlewares/auth.middleware');

const router = Router();

const reservationValidation = [
  body('playerId').notEmpty().withMessage('O jogador é obrigatório.'),
  body('courtId').notEmpty().withMessage('A quadra é obrigatória.'),
  body('date').notEmpty().withMessage('A data é obrigatória.'),
  body('startTime').notEmpty().withMessage('O horário inicial é obrigatório.'),
  body('endTime').notEmpty().withMessage('O horário final é obrigatório.'),
];

// Consulta de disponibilidade (horários ocupados de uma quadra numa data).
// Precisa vir ANTES de '/:id', senão o Express trataria "availability"
// como se fosse um :id. Qualquer usuário autenticado pode consultar —
// não filtra por jogador nem expõe dados pessoais (ver controller).
router.get('/availability', authenticate, reservationController.getAvailability);

// ADMIN vê todas as reservas — JOGADOR vê apenas as suas (lógica no controller)
router.get('/', authenticate, reservationController.list);
router.get('/:id', authenticate, reservationController.getById);

// Qualquer usuário autenticado pode criar reserva
router.post('/', authenticate, reservationValidation, validate, reservationController.create);

// ADMIN edita qualquer reserva — JOGADOR cancela apenas as suas (lógica no controller)
router.put('/:id', authenticate, reservationValidation, validate, reservationController.update);
router.delete('/:id', authenticate, reservationController.remove);

module.exports = router;
