import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserRole = 'creator' | 'brand' | 'admin';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  full_name: string | null;
  avatar_url: string | null;
  is_verified: boolean;
  is_suspended: boolean;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isInitialized: boolean;
  
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setInitialized: (initialized: boolean) => void;
  clearAuth: () => void;
  
  // Computed helpers
  isAuthenticated: () => boolean;
  isCreator: () => boolean;
  isBrand: () => boolean;
  isAdmin: () => boolean;
  getDashboardPath: () => string;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: true,
      isInitialized: false,

      setUser: (user) => set({ user, isLoading: false }),
      
      setLoading: (loading) => set({ isLoading: loading }),
      
      setInitialized: (initialized) => set({ isInitialized: initialized }),
      
      clearAuth: () => set({ user: null, isLoading: false }),

      isAuthenticated: () => {
        const { user } = get();
        return !!user;
      },

      isCreator: () => {
        const { user } = get();
        return user?.role === 'creator';
      },

      isBrand: () => {
        const { user } = get();
        return user?.role === 'brand';
      },

      isAdmin: () => {
        const { user } = get();
        return user?.role === 'admin';
      },

      getDashboardPath: () => {
        const { user } = get();
        return user ? `/dashboard/${user.role}` : '/';
      },
    }),
    {
      name: 'sponsornepal-auth',
      partialize: (state) => ({
        user: state.user,
        isInitialized: state.isInitialized,
      }),
    }
  )
);