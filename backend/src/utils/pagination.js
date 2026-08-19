/**
 * Helpers de paginação para as listagens.
 * Convertem `page`/`limit` recebidos na querystring em `skip`/`take`
 * do Prisma, com padrões seguros (página 1, 10 itens, teto de 100).
 */
function parsePagination({ page, limit } = {}) {
  const pageNumber = Math.max(parseInt(page, 10) || 1, 1);
  const limitNumber = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 100);

  return {
    page: pageNumber,
    limit: limitNumber,
    skip: (pageNumber - 1) * limitNumber,
    take: limitNumber,
  };
}

function buildMeta({ total, page, limit }) {
  return {
    total,
    totalPages: Math.ceil(total / limit),
    page,
    limit,
  };
}

module.exports = { parsePagination, buildMeta };
