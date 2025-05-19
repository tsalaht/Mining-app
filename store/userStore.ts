import { create, StateCreator } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  bio: string;
  age: number;
  location: string;
  interests: string[];
  preferences: {
    distance: number;
    ageRange: {
      min: number;
      max: number;
    };
  };
  isVerified: boolean;
}

interface UserState {
  currentUser: User | null;
  isAuthenticated: boolean;
  theme: 'light' | 'dark';
  language: string;
  notifications: boolean;
  
  // Actions
  setCurrentUser: (user: User | null) => void;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setLanguage: (language: string) => void;
  setNotifications: (notifications: boolean) => void;
  updateProfile: (updates: Partial<User>) => void;
}

const createUserStore: StateCreator<UserState> = (set) => ({
  currentUser: null,
  isAuthenticated: false,
  theme: 'light',
  language: 'en',
  notifications: true,

  setCurrentUser: (user) => set((state) => ({ ...state, currentUser: user })),
  
  setIsAuthenticated: (isAuthenticated) => 
    set((state) => ({ ...state, isAuthenticated })),
  
  setTheme: (theme) => set((state) => ({ ...state, theme })),
  
  setLanguage: (language) => set((state) => ({ ...state, language })),
  
  setNotifications: (notifications) => 
    set((state) => ({ ...state, notifications })),
  
  updateProfile: (updates) =>
    set((state) => ({
      ...state,
      currentUser: state.currentUser ? { ...state.currentUser, ...updates } : null,
    })),
});

export const useUserStore = create<UserState>()(
  persist(createUserStore, {
    name: 'user-storage',
  })
); 