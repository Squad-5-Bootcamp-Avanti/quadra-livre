/**
 * Formatação padronizada das respostas de sucesso da API.
 * Mantém o mesmo "shape" em todos os endpoints, facilitando
 * o consumo pelo frontend.
 */
function success(res, { statusCode = 200, data = null, message = 'OK' }) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
}

module.exports = { success };
