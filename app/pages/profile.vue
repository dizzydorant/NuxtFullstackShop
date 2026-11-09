<script setup lang="ts">
import { ref } from "vue";

definePageMeta({
  middleware: "auth",
});

const authStore = useAuthStore();

const currentPage = ref(1);
const itemsPerPage = 5;

const {
  data: response,
  error,
  pending,
} = await useFetch<any>("/api/orders/my", {
  query: {
    page: currentPage,
    limit: itemsPerPage,
  },
});
</script>

<template>
  <div class="profile-page">
    <h1 class="page-title">Личный кабинет</h1>

    <UserProfileCard :email="authStore.user?.email" :id="authStore.user?.id" />

    <h2 class="orders-title">История ваших заказов</h2>

    <div v-if="pending" class="loading-box">Загрузка истории...</div>

    <div v-else-if="error" class="error-box">
      Не удалось загрузить историю заказов.
    </div>

    <div
      v-else-if="!response?.orders || response.orders.length === 0"
      class="no-orders-box"
    >
      <p>Вы еще не совершили ни одной покупки 😟</p>
      <NuxtLink to="/" class="shop-now-btn">Перейти в каталог товаров</NuxtLink>
    </div>

    <div v-else class="orders-container">
      <div class="orders-list">
        <OrderCard
          v-for="order in response.orders"
          :key="order.id"
          :order="order"
        />
      </div>

      <AppPagination
        v-model="currentPage"
        :totalPages="response.meta.totalPages"
      />
    </div>
  </div>
</template>

<style scoped>
.profile-page {
  padding-top: 10px;
}

.page-title {
  color: #34495e;
  margin-bottom: 25px;
}

.orders-title {
  color: #34495e;
  margin-bottom: 20px;
  font-size: 20px;
}

.orders-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.no-orders-box {
  text-align: center;
  padding: 40px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px dashed #cbd5e1;
}

.shop-now-btn {
  display: inline-block;
  background: #41b883;
  color: white;
  text-decoration: none;
  padding: 10px 20px;
  border-radius: 6px;
  font-weight: bold;
  margin-top: 15px;
}

.loading-box {
  text-align: center;
  color: #64748b;
  padding: 20px;
}
</style>
