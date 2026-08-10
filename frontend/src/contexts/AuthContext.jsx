import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  // Restaura sessão do localStorage ao carregar o app
  useEffect(() => {
    const storedUser  = localStorage.getItem('quadra_livre_user');
    const storedToken = localStorage.getItem('quadra_livre_token');

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    const { player, token } = data.data;

    localStorage.setItem('quadra_livre_token', token);
    localStorage.setItem('quadra_livre_user', JSON.stringify(player));
    setUser(player);

    return player;
  }, []);

  const register = useCallback(async (formData) => {
    const { data } = await api.post('/auth/register', formData);
    const { player, token } = data.data;

    localStorage.setItem('quadra_livre_token', token);
    localStorage.setItem('quadra_livre_user', JSON.stringify(player));
    setUser(player);

    return player;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('quadra_livre_token');
    localStorage.removeItem('quadra_livre_user');
    setUser(null);
  }, []);

  const isAdmin  = user?.role === 'ADMIN';
  const isLogged = !!user;

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, isLogged, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return context;
}
