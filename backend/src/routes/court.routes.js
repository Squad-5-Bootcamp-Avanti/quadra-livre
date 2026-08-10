const { Router } = require('express');
const { body } = require('express-validator');
const validate = require('../middlewares/validate.middleware');
const courtController = require('../controllers/court.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');

const router = Router();

const courtValidation = [
  body('name').trim().notEmpty().withMessage('O nome é obrigatório.'),
  body('sport')
    .isIn(['SOCCER', 'FUTSAL', 'VOLLEYBALL', 'BASKETBALL', 'TENNIS', 'BEACH_TENNIS', 'OTHER'])
    .withMessage('Modalidade esportiva inválida.'),
  body('location').trim().notEmpty().withMessage('A localização é obrigatória.'),
];

// Rotas públicas — qualquer um pode visualizar quadras
router.get('/', courtController.list);
router.get('/:id', courtController.getById);

// Rotas protegidas — apenas ADMIN pode criar, editar e excluir
router.post('/', authenticate, authorize('ADMIN'), courtValidation, validate, courtController.create);
router.put('/:id', authenticate, authorize('ADMIN'), courtValidation, validate, courtController.update);
router.delete('/:id', authenticate, authorize('ADMIN'), courtController.remove);

module.exports = router;
