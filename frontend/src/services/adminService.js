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

export async function getCourts() {
  const response = await api.get('/courts');
  return response.data.data;
}

export async function createCourt(data) {
  const response = await api.post('/courts', data);
  return response.data.data;
}

export async function updateCourt(id, data) {
  const response = await api.put(`/courts/${id}`, data);
  return response.data.data;
}

export async function deleteCourt(id) {
  const response = await api.delete(`/courts/${id}`);
  return response.data.data;
}

export async function setPlayerStatus(id, isActive) {
  const response = await api.patch(`/players/${id}/status`, { isActive });
  return response.data.data;
}

export async function setPlayerRole(id, role) {
  const response = await api.patch(`/auth/users/${id}/role`, { role });
  return response.data.data;
}

export async function deletePlayer(id) {
  const response = await api.delete(`/players/${id}`);
  return response.data.data;
}
