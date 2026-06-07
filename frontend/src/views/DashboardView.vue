<template>
  <div class="dashboard-container">
    <div class="dashboard-card">
      <h2>欢迎，{{ userStore.user?.username }}!</h2>
      <div class="user-info">
        <p><strong>用户名：</strong>{{ userStore.user?.username }}</p>
        <p><strong>邮箱：</strong>{{ userStore.user?.email }}</p>
      </div>
      <button
        class="logout-btn"
        @click="handleLogout"
      >
        退出登录
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';

const router = useRouter();
const userStore = useUserStore();

onMounted(async () => {
  if (!userStore.token) {
    router.push('/login');
  } else {
    await userStore.fetchCurrentUser();
  }
});

const handleLogout = () => {
  userStore.logout();
};
</script>

<style scoped>
.dashboard-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.dashboard-card {
  background: white;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 500px;
  text-align: center;
}

h2 {
  color: #333;
  margin-bottom: 30px;
  font-size: 28px;
}

.user-info {
  background-color: #f5f5f5;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 30px;
  text-align: left;
}

.user-info p {
  margin: 10px 0;
  color: #555;
  font-size: 16px;
}

.user-info strong {
  color: #333;
}

.logout-btn {
  padding: 12px 30px;
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.logout-btn:hover {
  background-color: #c0392b;
}
</style>
