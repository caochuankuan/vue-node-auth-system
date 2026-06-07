import { defineStore } from 'pinia';
import { ref } from 'vue';
import { authAPI } from '@/services/api';
import router from '@/router';

export const useUserStore = defineStore('user', () => {
  const user = ref<any>(null);
  const token = ref<string | null>(localStorage.getItem('token'));

  // Register user
  const register = async (data: { username: string; email: string; password: string; verificationCode: string }) => {
    try {
      const response = await authAPI.register(data);
      user.value = response.data;
      token.value = response.data.token;
      localStorage.setItem('token', response.data.token);
      return { success: true };
    } catch (error: any) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Registration failed' 
      };
    }
  };

  // Login user
  const login = async (data: { email: string; password: string }) => {
    try {
      const response = await authAPI.login(data);
      user.value = response.data;
      token.value = response.data.token;
      localStorage.setItem('token', response.data.token);
      return { success: true };
    } catch (error: any) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  // Send verification code
  const sendVerificationCode = async (email: string) => {
    try {
      await authAPI.sendVerificationCode(email);
      return { success: true };
    } catch (error: any) {
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
    } catch (_error) {
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
