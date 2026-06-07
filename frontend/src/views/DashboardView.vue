<template>
  <div class="dashboard-container">
    <div class="dashboard-card">
      <h2>欢迎，{{ userStore.user?.username }}!</h2>
      <div class="user-info">
        <div class="info-item">
          <span class="label">用户名：</span>
          <span class="value">{{ userStore.user?.username }}</span>
        </div>
        <div class="info-item">
          <span class="label">邮箱：</span>
          <span class="value">{{ userStore.user?.email }}</span>
        </div>
      </div>
      <button @click="handleLogout" class="logout-btn">退出登录</button>
    </div>
  </div>
</template>

<script setup>
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
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.dashboard-card {
  background: white;
  padding: 50px;
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  width: 100%;
  max-width: 600px;
  text-align: center;
  animation: slideUp 0.5s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

h2 {
  color: #333;
  margin-bottom: 40px;
  font-size: 36px;
  font-weight: 700;
}

.user-info {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 30px;
  border-radius: 12px;
  margin-bottom: 40px;
  text-align: left;
}

.info-item {
  display: flex;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.info-item:last-child {
  border-bottom: none;
}

.label {
  font-weight: 600;
  color: #555;
  font-size: 16px;
  min-width: 100px;
}

.value {
  color: #333;
  font-size: 16px;
  flex: 1;
}

.logout-btn {
  padding: 14px 40px;
  background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
}

.logout-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(231, 76, 60, 0.4);
}

.logout-btn:active {
  transform: translateY(0);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .dashboard-card {
    padding: 30px 20px;
  }

  h2 {
    font-size: 28px;
  }

  .user-info {
    padding: 20px;
  }

  .info-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }

  .label {
    min-width: auto;
  }
}
</style>
