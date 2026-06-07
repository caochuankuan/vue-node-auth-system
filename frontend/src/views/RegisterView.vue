<template>
  <div class="register-container">
    <div class="register-card">
      <h2>用户注册</h2>
      <form @submit.prevent="handleRegister">
        <div class="form-group">
          <label for="username">用户名</label>
          <input
            id="username"
            v-model="formData.username"
            type="text"
            placeholder="请输入用户名"
            required
            minlength="3"
            maxlength="30"
          >
        </div>

        <div class="form-group">
          <label for="email">邮箱</label>
          <div class="email-input-group">
            <input
              id="email"
              v-model="formData.email"
              type="email"
              placeholder="请输入邮箱"
              required
              :disabled="codeSent"
            >
            <button
              type="button"
              class="send-code-btn"
              :disabled="!formData.email || codeSent || sendingCode"
              @click="handleSendCode"
            >
              {{ sendingCode ? '发送中...' : codeSent ? `${countdown}s` : '获取验证码' }}
            </button>
          </div>
        </div>

        <div class="form-group">
          <label for="verificationCode">验证码</label>
          <input
            id="verificationCode"
            v-model="formData.verificationCode"
            type="text"
            placeholder="请输入6位验证码"
            required
            maxlength="6"
          >
        </div>

        <div class="form-group">
          <label for="password">密码</label>
          <input
            id="password"
            v-model="formData.password"
            type="password"
            placeholder="请输入密码（至少6位）"
            required
            minlength="6"
          >
        </div>

        <div class="form-group">
          <label for="confirmPassword">确认密码</label>
          <input
            id="confirmPassword"
            v-model="formData.confirmPassword"
            type="password"
            placeholder="请再次输入密码"
            required
          >
        </div>

        <div
          v-if="errorMessage"
          class="error-message"
        >
          {{ errorMessage }}
        </div>

        <button
          type="submit"
          class="submit-btn"
          :disabled="loading"
        >
          {{ loading ? '注册中...' : '注册' }}
        </button>
      </form>

      <p class="login-link">
        已有账号？<router-link to="/login">
          立即登录
        </router-link>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';

const router = useRouter();
const userStore = useUserStore();

const formData = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  verificationCode: ''
});

const loading = ref(false);
const sendingCode = ref(false);
const codeSent = ref(false);
const countdown = ref(0);
const errorMessage = ref('');

let countdownTimer: number | null = null;

const handleSendCode = async () => {
  if (!formData.email) {
    errorMessage.value = '请输入邮箱地址';
    return;
  }

  // Validate email format
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  if (!emailRegex.test(formData.email)) {
    errorMessage.value = '请输入有效的邮箱地址';
    return;
  }

  sendingCode.value = true;
  errorMessage.value = '';

  const result = await userStore.sendVerificationCode(formData.email);

  sendingCode.value = false;

  if (result.success) {
    codeSent.value = true;
    countdown.value = 60;
    
    countdownTimer = window.setInterval(() => {
      countdown.value--;
      if (countdown.value <= 0) {
        codeSent.value = false;
        if (countdownTimer) {
          clearInterval(countdownTimer);
          countdownTimer = null;
        }
      }
    }, 1000);

    alert('验证码已发送到您的邮箱，请查收');
  } else {
    errorMessage.value = result.message || '发送验证码失败';
  }
};

const handleRegister = async () => {
  errorMessage.value = '';

  // Validate passwords match
  if (formData.password !== formData.confirmPassword) {
    errorMessage.value = '两次输入的密码不一致';
    return;
  }

  // Validate verification code
  if (formData.verificationCode.length !== 6) {
    errorMessage.value = '请输入6位验证码';
    return;
  }

  loading.value = true;

  const result = await userStore.register({
    username: formData.username,
    email: formData.email,
    password: formData.password,
    verificationCode: formData.verificationCode
  });

  loading.value = false;

  if (result.success) {
    alert('注册成功！');
    router.push('/dashboard');
  } else {
    errorMessage.value = result.message || '注册失败';
  }
};
</script>

<style scoped>
.register-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.register-card {
  background: white;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 450px;
}

h2 {
  text-align: center;
  color: #333;
  margin-bottom: 30px;
  font-size: 28px;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  color: #555;
  font-weight: 500;
}

input {
  width: 100%;
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 5px;
  font-size: 14px;
  transition: border-color 0.3s;
}

input:focus {
  outline: none;
  border-color: #667eea;
}

input:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.email-input-group {
  display: flex;
  gap: 10px;
}

.email-input-group input {
  flex: 1;
}

.send-code-btn {
  padding: 12px 20px;
  background-color: #667eea;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  white-space: nowrap;
  transition: background-color 0.3s;
}

.send-code-btn:hover:not(:disabled) {
  background-color: #5568d3;
}

.send-code-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.submit-btn {
  width: 100%;
  padding: 14px;
  background-color: #667eea;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-top: 10px;
}

.submit-btn:hover:not(:disabled) {
  background-color: #5568d3;
}

.submit-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.error-message {
  background-color: #fee;
  color: #c33;
  padding: 12px;
  border-radius: 5px;
  margin-bottom: 15px;
  text-align: center;
}

.login-link {
  text-align: center;
  margin-top: 20px;
  color: #666;
}

.login-link a {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
}

.login-link a:hover {
  text-decoration: underline;
}
</style>
