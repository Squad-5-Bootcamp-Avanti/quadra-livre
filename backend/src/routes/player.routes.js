const { Router } = require('express');
const { body } = require('express-validator');
const validate = require('../middlewares/validate.middleware');
const playerController = require('../controllers/player.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');

const router = Router();

const playerValidation = [
  body('name').trim().notEmpty().withMessage('O nome é obrigatório.'),
  body('email').isEmail().withMessage('E-mail inválido.'),
  body('phone').trim().notEmpty().withMessage('O telefone é obrigatório.'),
];

// Apenas ADMIN lista todos os jogadores e deleta qualquer um
router.get('/', authenticate, authorize('ADMIN'), playerController.list);
router.delete('/:id', authenticate, authorize('ADMIN'), playerController.remove);

// Jogador autenticado pode ver e editar seu próprio perfil
router.get('/:id', authenticate, playerController.getById);
router.put('/:id', authenticate, playerValidation, validate, playerController.update);

// Cadastro via /api/auth/register — esta rota não é mais necessária publicamente,
// mantida protegida por ADMIN para compatibilidade com o código existente.
router.post('/', authenticate, authorize('ADMIN'), playerValidation, validate, playerController.create);

module.exports = router;
