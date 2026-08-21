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

/**
 * 4. Consultar os horários já ocupados de uma quadra numa data.
 * Diferente de getReservations(), este endpoint mostra os horários
 * ocupados por TODOS os jogadores (não só os meus) — é o que a tela
 * de disponibilidade em tempo real precisa para funcionar direito —
 * mas devolve só startTime/endTime, sem nenhum dado pessoal de quem
 * fez a reserva.
 */
export async function getCourtAvailability({ courtId, date }) {
  const response = await api.get('/reservations/availability', { params: { courtId, date } });
  return response.data.data;
}
