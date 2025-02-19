import axios from 'axios';
import { useUserRoleStore } from '@/store/userRoleStore';

const baseURL = `${process.env.NEXT_PUBLIC_SERVER_URL}`;

export const defaultAxios = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor
defaultAxios.interceptors.request.use((config) => {
  const { userRole } = useUserRoleStore.getState();
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;

  if (userRole === 'ROLE_CUSTOM' && token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  return config;
});

// Response Interceptor
defaultAxios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const { userRole } = useUserRoleStore.getState();

    if (error.response) {
      const errorMessage = error.response.data?.message;
      if (
        (error.response && error.response.status === 401) ||
        (errorMessage && errorMessage.includes('JWT expired'))
      ) {
        if (typeof window !== 'undefined' && userRole === 'ROLE_CUSTOM') {
          localStorage.removeItem('authToken');
          window.location.href = '/';
        }
      }
    }

    return Promise.reject(error);
  },
);
