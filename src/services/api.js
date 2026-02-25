import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

let isRefreshing = false;

let failedQueue = [];


const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

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
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;


    if (
      originalRequest.url.includes('/auth/login') || 
      originalRequest.url.includes('/auth/register') ||
      originalRequest.url.includes('/auth/refresh')
    ) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch(err => Promise.reject(err));
      }
      
      originalRequest._retry = true;
      isRefreshing = true;  

      try {
        
        const response = await axios.post(
          `${API_URL}/auth/refresh`,
          {},
          { withCredentials: true }  
        );

        const { accessToken } = response.data;
        
        localStorage.setItem('accessToken', accessToken);

        processQueue(null, accessToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        
        const retryResponse = await api(originalRequest);
        return retryResponse;
        
      } catch (refreshError) {
        console.error('ОШИБКА REFRESH:', refreshError.response?.data || refreshError.message);
        console.error('Статус:', refreshError.response?.status);
        
        processQueue(refreshError, null);
        
        console.error('Очищаем localStorage и разлогиниваем!');
        console.error('==================================');
        
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        window.location.href = '/auth';
        return Promise.reject(refreshError);
        
      } finally {
        isRefreshing = false;  
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