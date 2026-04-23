import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      isAuthenticated: false,

      setAuth: (token: string) => set({ 
        token, 
        isAuthenticated: true 
      }),

      logout: () => {
        set({ token: null, isAuthenticated: false });
        localStorage.removeItem('auth-storage');
      },
    }),
    {
      name: 'auth-storage',
      version: 2, // Tăng version để reset cache cũ
      partialize: (state) => ({
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);