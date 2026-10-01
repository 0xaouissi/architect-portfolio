import { createContext, useContext, useEffect, useState } from 'react';
import api from './api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(() => {
    const raw = localStorage.getItem('admin');
    return raw ? JSON.parse(raw) : null;
  });

  useEffect(() => {
    if (admin) localStorage.setItem('admin', JSON.stringify(admin));
    else localStorage.removeItem('admin');
  }, [admin]);

  async function login(email, password) {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', data.token);
    setAdmin(data.admin);
    return data.admin;
  }

  function logout() {
    localStorage.removeItem('token');
    setAdmin(null);
  }

  return (
    <AuthContext.Provider value={{ admin, login, logout, isAuthenticated: !!admin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
