import api from './api';

/**
 * 1. Buscar as reservas do jogador logado.
 * Como o 'api' injeta o crachá (Token JWT) automaticamente na requisição,
 * o backend já sabe quem é o jogador logado e retorna apenas as reservas dele!
 */
export async function getReservations(params = {}) {
  const response = await api.get('/reservations', { params });
  return response.data.data;
}

/**
 * 2. Criar uma nova reserva.
 * @param {Object} reservationData - Objeto contendo { playerId, courtId, date, startTime, endTime }
 * Usamos 'api.post' porque estamos enviando dados novos para serem guardados.
 */
export async function createReservation(reservationData) {
  const response = await api.post('/reservations', reservationData);
  return response.data.data;
}

/**
 * 3. Cancelar uma reserva.
 * @param {string} id - O ID único da reserva que queremos cancelar
 * Usamos 'api.delete' com o ID da reserva na URL para o backend saber exatamente qual apagar.
 */
export async function cancelReservation(id) {
  const response = await api.delete(`/reservations/${id}`);
  return response.data.data;
}
