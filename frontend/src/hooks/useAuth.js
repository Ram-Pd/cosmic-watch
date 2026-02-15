import { useState, useEffect, useCallback } from 'react';

const storageKey = 'user';
const tokenKey = 'token';

export function useAuth() {
  const [user, setUser] = useState(() => {
    try {
      const s = localStorage.getItem(storageKey);
      return s ? JSON.parse(s) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem(tokenKey));

  const loginSuccess = useCallback((data) => {
    if (data.token) localStorage.setItem(tokenKey, data.token);
    if (data.user) {
      localStorage.setItem(storageKey, JSON.stringify(data.user));
      setUser(data.user);
    }
    if (data.token) setToken(data.token);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(tokenKey);
    localStorage.removeItem(storageKey);
    setToken(null);
    setUser(null);
  }, []);

  useEffect(() => {
    const onLogout = () => logout();
    window.addEventListener('auth:logout', onLogout);
    return () => window.removeEventListener('auth:logout', onLogout);
  }, [logout]);

  return { user, token, isAuthenticated: !!token, loginSuccess, logout };
}
