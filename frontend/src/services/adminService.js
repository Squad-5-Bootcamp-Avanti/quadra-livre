import api from './api';

export async function getStats() {
  const response = await api.get('/admin/stats');
  return response.data.data;
}

export async function getPlayers({ page, limit } = {}) {
  const response = await api.get('/players', { params: { page, limit } });
  return { data: response.data.data, meta: response.data.meta };
}

export async function getReservations({ page, limit, courtId, date, playerId } = {}) {
  const response = await api.get('/reservations', {
    params: { page, limit, courtId, date, playerId },
  });
  return { data: response.data.data, meta: response.data.meta };
}
