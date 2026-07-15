const { validationResult } = require('express-validator');
const ApiError = require('../utils/ApiError');

/**
 * Deve ser usado APÓS as validation chains do express-validator
 * (body(...), param(...), etc.) em cada rota.
 * Se houver erros de validação, interrompe a requisição com 400.
 */
function validate(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const message = errors
      .array()
      .map((err) => err.msg)
      .join(' ');

    return next(ApiError.badRequest(message, 'VALIDATION_ERROR'));
  }

  return next();
}

module.exports = validate;
