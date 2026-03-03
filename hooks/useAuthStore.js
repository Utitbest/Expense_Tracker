import { data } from 'autoprefixer';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useAuthStore = create(persist((set, get) => ({
      // State
      user: null,
      isLoading: false,
      isAuthenticated: false,

      // Actions
      setUser: (user) => set({ 
        user, 
        isAuthenticated: !!user,
      }),

      clearUser: () => set({ 
        user: null, 
        isAuthenticated: false,
      }),

      setLoading: (isLoading) => set({ isLoading }),

      // Fetch user from API
      fetchUser: async () => {
        set({ isLoading: true });
        try {
          const response = await fetch('/api/auth/me');
          const data = await response.json();
          if (data.success && data.user) {

            set({ 
              user: data.user, 
              isAuthenticated: true,
              isLoading: false 
            });
            return { success: true, user: data.user };
          } else {
            set({ 
              user: null, 
              isAuthenticated: false,
              isLoading: false 
            });
            return { success: false };
          }
        } catch (error) {
          console.error('Failed to fetch user:', error);
          set({ 
            user: null, 
            isAuthenticated: false,
            isLoading: false 
          });
          return { success: false };
        }
      },
    }),
    {
      name: 'auth-storage', // localStorage key or sessionStorage
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({ 
        user: state.user,
        isAuthenticated: state.isAuthenticated 
      }), // Only persist these fields
    }
  )
);