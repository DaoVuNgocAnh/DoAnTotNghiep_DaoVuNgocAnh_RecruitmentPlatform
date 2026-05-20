import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  userId: string | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  setAuth: (userId: string, token: string, refreshToken: string) => void;
  setTokens: (token: string, refreshToken: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      userId: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,

      setAuth: (userId: string, token: string, refreshToken: string) => set({ 
        userId,
        token, 
        refreshToken,
        isAuthenticated: true 
      }),

      setTokens: (token: string, refreshToken: string) => set({
        token,
        refreshToken
      }),

      logout: () => {
        set({ userId: null, token: null, refreshToken: null, isAuthenticated: false });
        localStorage.removeItem('auth-storage');
      },
    }),
    {
      name: 'auth-storage',
      version: 4, // Tăng version tiếp
      partialize: (state) => ({
        userId: state.userId,
        token: state.token,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);