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