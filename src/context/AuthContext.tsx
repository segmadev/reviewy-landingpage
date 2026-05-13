import React, { createContext, useContext, useState, useCallback } from 'react';
import type { User } from '../types/resume';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

interface AuthContextValue extends AuthState {
  login: (token: string, user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>(() => {
    // Restore session from localStorage if present
    // TODO: validate token expiry against real backend
    const token = localStorage.getItem('rym_token');
    const userRaw = localStorage.getItem('rym_user');
    if (token && userRaw) {
      try {
        return { token, user: JSON.parse(userRaw), isAuthenticated: true };
      } catch {
        // ignore corrupt storage
      }
    }
    return { token: null, user: null, isAuthenticated: false };
  });

  const login = useCallback((token: string, user: User) => {
    localStorage.setItem('rym_token', token);
    localStorage.setItem('rym_user', JSON.stringify(user));
    setState({ token, user, isAuthenticated: true });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('rym_token');
    localStorage.removeItem('rym_user');
    setState({ token: null, user: null, isAuthenticated: false });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
