const { Router } = require('express');
const { body } = require('express-validator');
const validate = require('../middlewares/validate.middleware');
const courtController = require('../controllers/court.controller');

const router = Router();

const courtValidation = [
  body('name').trim().notEmpty().withMessage('O nome é obrigatório.'),
  body('sport')
    .isIn(['SOCCER', 'FUTSAL', 'VOLLEYBALL', 'BASKETBALL', 'TENNIS', 'BEACH_TENNIS', 'OTHER'])
    .withMessage('Modalidade esportiva inválida.'),
  body('location').trim().notEmpty().withMessage('A localização é obrigatória.'),
];

router.post('/', courtValidation, validate, courtController.create);
router.get('/', courtController.list);
router.get('/:id', courtController.getById);
router.put('/:id', courtValidation, validate, courtController.update);
router.delete('/:id', courtController.remove);

module.exports = router;