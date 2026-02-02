
import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  // State
  user: null,
  role: null,
  loading: true,
  error: null,

  // Actions
  setUser: (user) => set({ user }),
  setRole: (role) => set({ role }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  // Logout
  logout: () =>
    set({
      user: null,
      role: null,
      loading:false,
      error: null,
    }),

  // Clear error
  clearError: () => set({ error: null }),
}));
