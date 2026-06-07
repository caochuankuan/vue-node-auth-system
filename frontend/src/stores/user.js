import { defineStore } from 'pinia';
import { ref } from 'vue';
import { authAPI } from '@/services/api';
import router from '@/router';

export const useUserStore = defineStore('user', () => {
  const user = ref(null);
  const token = ref(localStorage.getItem('token'));

  // Register user
  const register = async (data) => {
    try {
      const response = await authAPI.register(data);
      user.value = response.data;
      token.value = response.data.token;
      localStorage.setItem('token', response.data.token);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Registration failed' 
      };
    }
  };

  // Login user
  const login = async (data) => {
    try {
      const response = await authAPI.login(data);
      user.value = response.data;
      token.value = response.data.token;
      localStorage.setItem('token', response.data.token);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  // Send verification code
  const sendVerificationCode = async (email) => {
    try {
      await authAPI.sendVerificationCode(email);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to send verification code' 
      };
    }
  };

  // Logout
  const logout = () => {
    user.value = null;
    token.value = null;
    localStorage.removeItem('token');
    router.push('/login');
  };

  // Get current user
  const fetchCurrentUser = async () => {
    if (!token.value) return;
    try {
      const response = await authAPI.getCurrentUser();
      user.value = response.data;
    } catch (error) {
      logout();
    }
  };

  return {
    user,
    token,
    register,
    login,
    sendVerificationCode,
    logout,
    fetchCurrentUser
  };
});
