import api from './api';

export async function loginRequest(email, password) {
  const response = await api.post('/auth/login', { email, password });
  const { player, token } = response.data.data;
  return { player, token };
}

export async function registerRequest(formData) {
  const response = await api.post('/auth/register', formData);
  const { player, token } = response.data.data;
  return { player, token };
}
export async function getProfileRequest(id) {
  const response = await api.get(`/players/${id}`);
  return response.data.data; // ajuste aqui se o formato real vier diferente
}

export async function updateProfileRequest(id, data) {
  const response = await api.put(`/players/${id}`, data);
  return response.data.data; // ajuste aqui se o formato real vier diferente
}