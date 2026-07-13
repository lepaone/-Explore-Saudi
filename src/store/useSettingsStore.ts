import { create } from 'zustand';
import i18n from '../i18n';

interface SettingsState {
  language: 'en' | 'ar';
  theme: 'light' | 'dark';
  notifications: boolean;
  setLanguage: (language: 'en' | 'ar') => void;
  toggleTheme: () => void;
  toggleNotifications: () => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  language: 'en',
  theme: 'light',
  notifications: true,

  setLanguage: (language: 'en' | 'ar') => {
    i18n.changeLanguage(language);
    set({ language });
  },

  toggleTheme: () => {
    set((state) => ({
      theme: state.theme === 'light' ? 'dark' : 'light',
    }));
  },

  toggleNotifications: () => {
    set((state) => ({
      notifications: !state.notifications,
    }));
  },
}));
