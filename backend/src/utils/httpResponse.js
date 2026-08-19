/**
 * Formatação padronizada das respostas de sucesso da API.
 * Mantém o mesmo "shape" em todos os endpoints, facilitando
 * o consumo pelo frontend. O campo `meta` é opcional e usado
 * pelas listagens paginadas (total, totalPages, page, limit).
 */
function success(res, { statusCode = 200, data = null, message = 'OK', meta }) {
  const body = {
    success: true,
    message,
    data,
  };

  if (meta) {
    body.meta = meta;
  }

  return res.status(statusCode).json(body);
}

module.exports = { success };
