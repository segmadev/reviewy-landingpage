import React, { createContext, useContext, useState, useCallback } from 'react';
import type { User } from '../types/resume';
import { STORAGE_KEYS } from '../config/api.config';
import { tokenManager, http } from '../services/http-client';
import { getUserProfile } from '../services/api';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthContextValue extends AuthState {
  login: (accessToken: string, refreshToken: string, user: User) => void;
  logout: () => Promise<void>;
  fetchProfile: (token?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>(() => {
    // Restore session from localStorage if present
    const accessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
    const userRaw = localStorage.getItem(STORAGE_KEYS.USER);

    // Validate user data - skip if it's the string "undefined" or null
    if (accessToken && refreshToken && userRaw && userRaw !== 'undefined' && userRaw !== 'null') {
      try {
        const user = JSON.parse(userRaw);
        if (user && typeof user === 'object' && user.id) {
          return {
            accessToken,
            refreshToken,
            user,
            isAuthenticated: true,
            isLoading: false,
          };
        }
      } catch {
        // ignore corrupt storage
        console.error('Failed to parse user from storage');
      }
    }

    // Clear invalid tokens
    tokenManager.clearTokens();
    localStorage.removeItem(STORAGE_KEYS.USER);

    return {
      accessToken: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,
      isLoading: false,
    };
  });

  const login = useCallback((accessToken: string, refreshToken: string, user: User) => {
    // Ensure valid data before storing
    if (accessToken && refreshToken && user) {
      console.log('[AuthContext] Storing tokens:');
      console.log('  - accessToken:', accessToken.substring(0, 50) + '...');
      console.log('  - refreshToken:', refreshToken.substring(0, 50) + '...');
      console.log('  - user:', user.email);

      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));

      console.log('[AuthContext] Tokens stored in localStorage');
      console.log('  - rym_access_token:', localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)?.substring(0, 50) + '...');

      setState({
        accessToken,
        refreshToken,
        user,
        isAuthenticated: true,
        isLoading: false,
      });
    } else {
      console.error('[AuthContext] ✗ Missing required data for login:', {
        hasToken: !!accessToken,
        hasRefresh: !!refreshToken,
        hasUser: !!user
      });
    }
  }, []);

  const fetchProfile = useCallback(async (token?: string) => {
    // Use provided token or fall back to state token
    const tokenToUse = token || state.accessToken;
    console.log('[AuthContext] fetchProfile called, token:', tokenToUse ? '✓' : '✗');

    if (!tokenToUse) {
      console.warn('[AuthContext] No token available, skipping profile fetch');
      return;
    }

    console.log('[AuthContext] → Calling getUserProfile()...');
    setState((prev) => ({ ...prev, isLoading: true }));
    try {
      const profile = await getUserProfile();
      console.log('[AuthContext] ✓ Profile received:', profile?.email);

      if (profile) {
        // Update both state and localStorage
        setState((prev) => ({
          ...prev,
          user: profile,
          isLoading: false,
        }));
        // Ensure we store valid JSON
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(profile));
        console.log('[AuthContext] ✓ Stored in localStorage');
      }
    } catch (error) {
      console.error('[AuthContext] ✗ Profile fetch failed:', error instanceof Error ? error.message : error);
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  }, [state.accessToken]);

  const logout = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true }));
    try {
      // Call backend logout endpoint
      if (state.user?.id) {
        try {
          await http.delete(`/user/logout/${state.user.id}`);
        } catch (error) {
          // Continue with logout even if backend call fails
          console.error('Logout API call failed:', error);
        }
      }
    } finally {
      tokenManager.clearTokens();
      setState({
        accessToken: null,
        refreshToken: null,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  }, [state.user?.id]);

  return (
    <AuthContext.Provider value={{ ...state, login, logout, fetchProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
