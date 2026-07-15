/**
 * Envolve um handler assíncrono de rota, capturando qualquer erro
 * (rejeição de Promise) e repassando para o middleware de erro global,
 * evitando repetir try/catch em cada Controller.
 */
function asyncHandler(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}

module.exports = asyncHandler;
