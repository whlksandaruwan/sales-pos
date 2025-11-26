import { create } from 'zustand';

type User = {
  id: number;
  email: string;
  fullName: string;
  role: string;
};

type AuthState = {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  setAuth: (user: User, accessToken: string, refreshToken: string) => void;
  clearAuth: () => void;
};

const STORAGE_KEY = 'bookshop-pos-auth';

function loadInitialState(): Pick<
  AuthState,
  'user' | 'accessToken' | 'refreshToken'
> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { user: null, accessToken: null, refreshToken: null };
    return JSON.parse(raw);
  } catch {
    return { user: null, accessToken: null, refreshToken: null };
  }
}

export const useAuthStore = create<AuthState>((set) => ({
  ...loadInitialState(),
  setAuth: (user, accessToken, refreshToken) => {
    const payload = { user, accessToken, refreshToken };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    set(payload);
  },
  clearAuth: () => {
    localStorage.removeItem(STORAGE_KEY);
    set({ user: null, accessToken: null, refreshToken: null });
  },
}));


