const adminService = require('../services/admin.service');
const asyncHandler = require('../utils/asyncHandler');
const { success } = require('../utils/httpResponse');

const stats = asyncHandler(async (req, res) => {
  const data = await adminService.getStats();

  return success(res, {
    data,
    message: 'Estatísticas do painel carregadas com sucesso.',
  });
});

module.exports = {
  stats,
};
