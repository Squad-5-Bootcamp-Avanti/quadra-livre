const { Router } = require('express');
const { body } = require('express-validator');
const validate = require('../middlewares/validate.middleware');
const playerController = require('../controllers/player.controller');

const router = Router();

const playerValidation = [
  body('name').trim().notEmpty().withMessage('O nome é obrigatório.'),
  body('email').isEmail().withMessage('E-mail inválido.'),
  body('phone').trim().notEmpty().withMessage('O telefone é obrigatório.'),
];

router.post('/', playerValidation, validate, playerController.create);
router.get('/', playerController.list);
router.get('/:id', playerController.getById);
router.put('/:id', playerValidation, validate, playerController.update);
router.delete('/:id', playerController.remove);

module.exports = router;