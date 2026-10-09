import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { create } from 'zustand';
import { createJSONStorage, persist, type StateStorage } from 'zustand/middleware';
import type { Language } from './translations';

const webStorage: StateStorage = {
  getItem: (name) => typeof localStorage === 'undefined' ? null : localStorage.getItem(name),
  setItem: (name, value) => { if (typeof localStorage !== 'undefined') localStorage.setItem(name, value); },
  removeItem: (name) => { if (typeof localStorage !== 'undefined') localStorage.removeItem(name); },
};

type LanguageState = { language: Language; setLanguage: (language: Language) => void };

export const useLanguageStore = create<LanguageState>()(persist(
  (set) => ({ language: 'es', setLanguage: (language) => set({ language }) }),
  {
    name: 'task-management-language',
    storage: createJSONStorage(() => Platform.OS === 'web' ? webStorage : AsyncStorage),
    partialize: (state) => ({ language: state.language }),
  },
));
