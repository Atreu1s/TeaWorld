import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken'); 
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 🔑 НОВОЕ: НЕ ДЕЛАТЬ REFRESH ДЛЯ ЗАПРОСОВ АВТОРИЗАЦИИ!
    if (
      originalRequest.url.includes('/auth/login') || 
      originalRequest.url.includes('/auth/register') ||
      originalRequest.url.includes('/auth/refresh')
    ) {
      return Promise.reject(error);
    }

    // Если ошибка 401 и запрос ещё не повторялся
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const response = await axios.post(
          `${API_URL}/auth/refresh`,
          {},
          { withCredentials: true }  
        );

        const { accessToken } = response.data;
        localStorage.setItem('accessToken', accessToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        window.location.href = '/auth';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export const authAPI = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    if (response.data.accessToken) {
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.accessToken) {
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');  
    } catch (error) {
      console.error('Ошибка выхода:', error);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
    }
  },

  getCurrentUser: async () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  isLoggedIn: () => {
    return !!localStorage.getItem('accessToken');  
  },

  getUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }
};

export default api;