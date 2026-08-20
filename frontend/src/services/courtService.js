import api from './api';

// Serviço público de quadras — usado nas páginas de listagem e detalhe
// (rotas /quadras e /quadras/:id). Endpoints públicos, sem autenticação.

export async function getCourts() {
  const response = await api.get('/courts');
  return response.data.data;
}

export async function getCourtById(id) {
  const response = await api.get(`/courts/${id}`);
  return response.data.data;
}
