'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api/auth.api';
import type { User, UserRole } from '@/types';

// ─── Types ────────────────────────────────────────────────────────────────────

interface AuthState {
  user:            User | null;
  isLoading:       boolean;
  isAuthenticated: boolean;
}

interface AuthContextValue extends AuthState {
  login:       (email: string, password: string) => Promise<void>;
  logout:      () => Promise<void>;
  refreshUser: () => Promise<void>;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// ─── Role-based redirect map ──────────────────────────────────────────────────
const DASHBOARD_ROUTES: Record<UserRole, string> = {
  student: '/student/dashboard',
  teacher: '/teacher/dashboard',
  admin:   '/teacher/dashboard',
};

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [state, setState] = useState<AuthState>({
    user:            null,
    isLoading:       true,
    isAuthenticated: false,
  });

  const refreshUser = useCallback(async () => {
    try {
      const res = await authApi.getMe();
      setState({ user: res.data.user, isLoading: false, isAuthenticated: true });
    } catch {
      setState({ user: null, isLoading: false, isAuthenticated: false });
    }
  }, []);

  // Hydrate on mount — check if cookie-based session exists
  useEffect(() => { refreshUser(); }, [refreshUser]);

  const login = async (email: string, password: string) => {
    const res  = await authApi.login({ email, password });
    const user = res.data.user;
    setState({ user, isLoading: false, isAuthenticated: true });
    if (user.role === 'student' && user.status === 'pending') {
      router.push('/student/dashboard?pending=1');
    } else {
      router.push(DASHBOARD_ROUTES[user.role]);
    }
    router.refresh();
  };




  const logout = async () => {
    await authApi.logout();
    setState({ user: null, isLoading: false, isAuthenticated: false });
    router.push('/login');
    router.refresh();
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
