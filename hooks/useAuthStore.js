import { data } from 'autoprefixer';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      isAuthenticated: false,

      setUser: (user) => set({ 
        user, 
        isAuthenticated: !!user,
      }),

      clearUser: () => set({ 
        user: null, 
        isAuthenticated: false,
      }),

      setLoading: (isLoading) => set({ isLoading }),

      fetchUser: async () => {
        set({ isLoading: true });
        
        try {
          const response = await fetch('/api/auth/me', {
            signal: AbortSignal.timeout(15000),
          }
        );

          if (response.status === 401) {
            console.log("401 Unauthorized - invalid token");
            set({ 
              user: null, 
              isAuthenticated: false,
              isLoading: false 
            });
            return { success: false, error: 'unauthorized' };
          }

          if (response.status === 503) {
            console.log("503 Service Unavailable - database is down");
            set({ isLoading: false });
            return { success: false, error: 'server_error' };
          }

          if (response.status === 500) {
            console.log("500 Server Error");
            set({ isLoading: false });
            return { success: false, error: 'server_error' };
          }

          if (!response.ok) {
            console.log(`Error: ${response.status}`);
            set({ isLoading: false });
            return { success: false, error: 'server_error' };
          }

          const data = await response.json();
          
          if (data.success && data.user) {
            set({ 
              user: data.user, 
              isAuthenticated: true,
              isLoading: false 
            });
            return { success: true, user: data.user };
          } else {
            console.log("No user in response");
            set({ 
              user: null, 
              isAuthenticated: false,
              isLoading: false 
            });
            return { success: false, error: 'unauthorized' };
          }
        } catch (error) {
          console.error('Fetch error:', error);
          set({ isLoading: false });
          
          if (error.name === 'AbortError') {
            return { success: false, error: 'timeout' };
          }
          
          return { success: false, error: 'network_error' };
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({ 
        user: state.user,
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);