<script setup lang="ts">
const cartStore = useCartStore();
const authStore = useAuthStore();

onMounted(() => {
  authStore.checkSession();
});
</script>

<template>
  <div class="app-layout">
    <header class="shop-header">
      <div class="header-logo">Nuxt-Shop 🛒</div>

      <div class="header-controls">
        <div class="auth-status">
          <template v-if="authStore.isAuthenticated">
            <NuxtLink to="/profile" class="profile-link">
              👤 {{ authStore.user?.email }}
            </NuxtLink>
            <button @click="authStore.logout" class="logout-btn">Выйти</button>
          </template>
          <NuxtLink v-else to="/login" class="login-link"
            >Войти в аккаунт</NuxtLink
          >
        </div>

        <NuxtLink to="/cart" class="header-cart">
          Корзина: <strong>{{ cartStore.totalCount }}</strong> шт. (<strong
            >{{ cartStore.totalPrice.toLocaleString() }} руб.</strong
          >)
        </NuxtLink>
      </div>
    </header>

    <main class="main-content">
      <slot />
    </main>
  </div>
</template>

<style scoped>
.app-layout {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: sans-serif;
}

.shop-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 30px;
  border: 1px solid #e9ecef;
}

.header-logo {
  font-size: 24px;
  font-weight: bold;
  color: #34495e;
}

.header-controls {
  display: flex;
  align-items: center;
  gap: 20px;
}

.auth-status {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
}

.user-email {
  color: #4a5568;
  font-weight: 600;
}

.logout-btn {
  background: #e53e3e;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
}

.logout-btn:hover {
  background: #c53030;
}

.login-link {
  color: #41b883;
  text-decoration: none;
  font-weight: bold;
}

.login-link:hover {
  text-decoration: underline;
}

.header-cart {
  text-decoration: none;
  font-size: 16px;
  color: #2c3e50;
  background: #e8f5e9;
  padding: 10px 15px;
  border-radius: 6px;
  border: 1px solid #c8e6c9;
  display: inline-block;
  transition: background 0.2s;
}

.header-cart:hover {
  background: #c8e6c9;
}

.profile-link {
  color: #34495e;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s;
}

.profile-link:hover {
  color: #41b883;
  text-decoration: underline;
}
</style>
