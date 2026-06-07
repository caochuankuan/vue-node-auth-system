import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
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
