import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3333/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// ── Interceptor de requisição — injeta o token JWT automaticamente
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('quadra_livre_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Interceptor de resposta — trata token expirado globalmente
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const code = error.response?.data?.error?.code;

    if (code === 'TOKEN_EXPIRED' || code === 'INVALID_TOKEN' || code === 'MISSING_TOKEN') {
      localStorage.removeItem('quadra_livre_token');
      localStorage.removeItem('quadra_livre_user');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default api;
