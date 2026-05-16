import { create } from 'zustand';
import api from '../api/axios';
import type { IUser, IAuthResponse } from '../types';

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  role?: 'admin' | 'sales';
}

interface AuthState {
  user: IUser | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  let initialUser: IUser | null = null;

  if (userStr) {
    try {
      initialUser = JSON.parse(userStr) as IUser;
    } catch (e) {
      console.error('Failed to parse stored user:', e);
    }
  }

  return {
    user: initialUser,
    token: token,
    isLoading: false,
    error: null,

    login: async (data: LoginData) => {
      set({ isLoading: true, error: null });
      try {
        const response = await api.post<IAuthResponse>('/auth/login', data);
        const { token, user } = response.data;

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        set({ token, user, isLoading: false });
      } catch (error: unknown) {
        const e = error as { response?: { data?: { message?: string } } };
        set({
          isLoading: false,
          error: e.response?.data?.message || 'Login failed',
        });
        throw error;
      }
    },

    register: async (data: RegisterData) => {
      set({ isLoading: true, error: null });
      try {
        const response = await api.post<IAuthResponse>('/auth/register', data);
        const { token, user } = response.data;

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        set({ token, user, isLoading: false });
      } catch (error: unknown) {
        const e = error as {
          response?: { data?: { message?: string; errors?: { msg: string }[] } };
        };
        set({
          isLoading: false,
          error:
            e.response?.data?.message ||
            e.response?.data?.errors?.[0]?.msg ||
            'Registration failed',
        });
        throw error;
      }
    },

    logout: () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      set({ user: null, token: null, error: null });
    },
  };
});
