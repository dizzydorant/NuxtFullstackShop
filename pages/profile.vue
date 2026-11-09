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

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getStatusText = (status: string) => {
  switch (status) {
    case "PENDING":
      return "В обработке";
    case "PAID":
      return "Оплачен";
    case "DELIVERED":
      return "Доставлен";
    default:
      return status;
  }
};
</script>

<template>
  <div class="profile-page">
    <h1 class="page-title">Личный кабинет</h1>

    <div class="user-info-card">
      <div class="user-avatar">👤</div>
      <div class="user-details">
        <h2>Ваш аккаунт</h2>
        <p class="user-email">
          Email: <strong>{{ authStore.user?.email }}</strong>
        </p>
        <p class="user-id">
          ID пользователя в базе: <code>#{{ authStore.user?.id }}</code>
        </p>
      </div>
    </div>

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
        <div
          v-for="order in response.orders"
          :key="order.id"
          class="order-card"
        >
          <div class="order-card-header">
            <div class="order-main-info">
              <span class="order-number">Заказ #{{ order.id }}</span>
              <span class="order-date">{{ formatDate(order.createdAt) }}</span>
            </div>
            <div :class="['order-status-badge', order.status.toLowerCase()]">
              {{ getStatusText(order.status) }}
            </div>
          </div>

          <div class="order-items-list">
            <div
              v-for="item in order.items"
              :key="item.id"
              class="order-item-row"
            >
              <img
                :src="item.product?.image || 'https://unsplash.com'"
                class="item-mini-img"
              />
              <div class="item-mini-details">
                <span class="item-mini-title">{{
                  item.product?.title || "Товар удален из каталога"
                }}</span>
                <span class="item-mini-meta"
                  >{{ item.price.toLocaleString() }} руб. x
                  {{ item.quantity }} шт.</span
                >
              </div>
              <div class="item-mini-total">
                {{ (item.price * item.quantity).toLocaleString() }} руб.
              </div>
            </div>
          </div>

          <div class="order-card-footer">
            <span>Итоговая сумма заказа:</span>
            <strong class="order-total-price"
              >{{ order.total.toLocaleString() }} руб.</strong
            >
          </div>
        </div>
      </div>

      <div v-if="response.meta?.totalPages > 1" class="pagination-controls">
        <button
          @click="currentPage--"
          :disabled="currentPage === 1"
          class="page-btn arrow-btn"
        >
          &larr; Назад
        </button>

        <div class="page-numbers">
          <button
            v-for="page in response.meta.totalPages"
            :key="page"
            @click="currentPage = page"
            :class="['page-btn', { active: currentPage === page }]"
          >
            {{ page }}
          </button>
        </div>

        <button
          @click="currentPage++"
          :disabled="currentPage === response.meta.totalPages"
          class="page-btn arrow-btn"
        >
          Вперед &rarr;
        </button>
      </div>
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

.user-info-card {
  display: flex;
  align-items: center;
  gap: 20px;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 40px;
}

.user-avatar {
  font-size: 40px;
  background: white;
  width: 70px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  border: 1px solid #dee2e6;
}

.user-details h2 {
  margin: 0 0 8px 0;
  font-size: 18px;
  color: #2c3e50;
}

.user-email,
.user-id {
  margin: 0;
  font-size: 14px;
  color: #4a5568;
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

.order-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  overflow: hidden;
}

.order-card-header {
  background: #f1f5f9;
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e2e8f0;
}

.order-main-info {
  display: flex;
  gap: 15px;
  align-items: center;
}

.order-number {
  font-weight: bold;
  color: #1e293b;
}

.order-date {
  font-size: 13px;
  color: #64748b;
}

.order-status-badge {
  font-size: 12px;
  font-weight: bold;
  padding: 4px 10px;
  border-radius: 20px;
}

.order-status-badge.pending {
  background: #fef3c7;
  color: #d97706;
}

.order-status-badge.paid {
  background: #dcfce7;
  color: #15803d;
}

.order-items-list {
  padding: 10px 20px;
}

.order-item-row {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 12px 0;
  border-bottom: 1px dashed #f1f5f9;
}

.order-item-row:last-child {
  border-bottom: none;
}

.item-mini-img {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 6px;
  background: #f1f5f9;
}

.item-mini-details {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.item-mini-title {
  font-size: 14px;
  font-weight: 600;
  color: #334155;
}

.item-mini-meta {
  font-size: 12px;
  color: #64748b;
}

.item-mini-total {
  font-size: 14px;
  font-weight: bold;
  color: #334155;
}

.order-card-footer {
  background: #f8fafc;
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid #e2e8f0;
  font-size: 15px;
  color: #475569;
}

.order-total-price {
  font-size: 18px;
  color: #1e293b;
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

/* СТИЛИ ДЛЯ БЛОКА ПАГИНАЦИИ */
.pagination-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  margin-top: 30px;
  padding: 20px 0;
}

.page-numbers {
  display: flex;
  gap: 8px;
}

.page-btn {
  background: white;
  border: 1px solid #cbd5e1;
  padding: 8px 14px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: #334155;
  transition: all 0.2s;
}

.page-btn:hover:not(:disabled) {
  border-color: #41b883;
  color: #41b883;
}

.page-btn.active {
  background: #41b883;
  border-color: #41b883;
  color: white;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background: #f1f5f9;
}

.arrow-btn {
  font-weight: bold;
}
</style>
