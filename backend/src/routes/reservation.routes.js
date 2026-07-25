const { Router } = require('express');
const { body } = require('express-validator');
const validate = require('../middlewares/validate.middleware');
const reservationController = require('../controllers/reservation.controller');

const router = Router();

const reservationValidation = [
  body('playerId').notEmpty().withMessage('O jogador é obrigatório.'),
  body('courtId').notEmpty().withMessage('A quadra é obrigatória.'),
  body('date').notEmpty().withMessage('A data é obrigatória.'),
  body('startTime').notEmpty().withMessage('O horário inicial é obrigatório.'),
  body('endTime').notEmpty().withMessage('O horário final é obrigatório.'),
];

router.post('/', reservationValidation, validate, reservationController.create);
router.get('/', reservationController.list);
router.get('/:id', reservationController.getById);
router.put('/:id', reservationValidation, validate, reservationController.update);
router.delete('/:id', reservationController.remove);

module.exports = router;