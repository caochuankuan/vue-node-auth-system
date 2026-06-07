import axios from 'axios';

// 开发环境使用完整 URL，生产环境使用相对路径（由后端代理）
const baseURL = import.meta.env.DEV 
  ? 'http://localhost:3000/api' 
  : '/api';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const authAPI = {
  // Send verification code
  sendVerificationCode(email) {
    return api.post('/auth/send-code', { email });
  },

  // Register user
  register(data) {
    return api.post('/auth/register', data);
  },

  // Login user
  login(data) {
    return api.post('/auth/login', data);
  },

  // Get current user
  getCurrentUser() {
    return api.get('/auth/me');
  }
};

export default api;
