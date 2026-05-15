import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Toast {
  id: string;
  title: string;
  description?: string;
  variant?: 'default' | 'success' | 'error' | 'warning';
  duration?: number;
}

interface UIState {
  sidebarOpen: boolean;
  toasts: Toast[];
  
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      sidebarOpen: true,
      toasts: [],

      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

      addToast: (toast) => {
        const id = Math.random().toString(36).substring(2, 9);
        const newToast = { ...toast, id };
        
        set((state) => ({
          toasts: [...state.toasts, newToast],
        }));

        const duration = toast.duration || 5000;
        setTimeout(() => {
          get().removeToast(id);
        }, duration);
      },

      removeToast: (id) => set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      })),

      clearToasts: () => set({ toasts: [] }),
    }),
    {
      name: 'sponsornepal-ui',
      partialize: (state) => ({
        sidebarOpen: state.sidebarOpen,
      }),
    }
  )
);

export const toast = {
  success: (title: string, description?: string) => {
    useUIStore.getState().addToast({ title, description, variant: 'success' });
  },
  error: (title: string, description?: string) => {
    useUIStore.getState().addToast({ title, description, variant: 'error' });
  },
  warning: (title: string, description?: string) => {
    useUIStore.getState().addToast({ title, description, variant: 'warning' });
  },
  default: (title: string, description?: string) => {
    useUIStore.getState().addToast({ title, description });
  },
};