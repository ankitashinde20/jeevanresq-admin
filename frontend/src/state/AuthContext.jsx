import { createContext, useContext, useMemo, useState } from 'react';
import { api } from '../api/client.js';
import { resetSocket } from '../api/socket.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('jrq_token'));
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('jrq_user');
    return raw ? JSON.parse(raw) : null;
  });

  async function login(username, password) {
    const { data } = await api.post('/auth/login', { username, password });
    localStorage.setItem('jrq_token', data.token);
    localStorage.setItem('jrq_user', JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
    return data.user;
  }

  function logout() {
    localStorage.removeItem('jrq_token');
    localStorage.removeItem('jrq_user');
    resetSocket();
    setToken(null);
    setUser(null);
  }

  const value = useMemo(() => ({ token, user, login, logout, isAuthenticated: Boolean(token) }), [token, user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

