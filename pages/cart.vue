<script setup lang="ts">
import { ref } from "vue";

// Подключаем middleware авторизации для защиты страницы
definePageMeta({
  middleware: "auth",
});

// Подключаем наши хранилища Pinia
const cartStore = useCartStore();
const authStore = useAuthStore();

// Достаем наш безопасный обработчик запросов из контекста Nuxt
const { $csrfFetch } = useNuxtApp();

// Реактивные переменные для обработки статуса заказа
const isLoading = ref(false);
const isSuccess = ref(false);
const orderNumber = ref<number | null>(null);
const errorMessage = ref("");

const handleCheckout = async () => {
  isLoading.value = true;
  errorMessage.value = "";

  try {
    const orderItems = cartStore.items.map((item) => ({
      id: item.id,
      quantity: item.quantity,
    }));

    const data = await $csrfFetch<{ success: boolean; orderId: number }>(
      "/api/orders/create",
      {
        method: "POST",
        body: { items: orderItems },
      },
    );

    if (data.success) {
      orderNumber.value = data.orderId;
      isSuccess.value = true;

      cartStore.clearCart();
    }
  } catch (error: any) {
    errorMessage.value =
      error.data?.statusMessage ||
      "Не удалось оформить заказ. Попробуйте позже.";
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="cart-page">
    <h1 class="page-title">Ваша корзина</h1>

    <div v-if="isSuccess" class="success-checkout">
      <h2>🎉 Заказ успешно оформлен!</h2>
      <p>
        Спасибо за покупку. Номер вашего заказа:
        <strong>#{{ orderNumber }}</strong>
      </p>
      <p class="sub-text">Менеджер уже начал сборку ваших гаджетов.</p>
      <NuxtLink to="/" class="back-link">Продолжить покупки</NuxtLink>
    </div>

    <div v-else-if="cartStore.items.length === 0" class="empty-cart">
      <p>В корзине пока ничего нет 😟</p>
      <NuxtLink to="/" class="back-link">Вернуться к покупкам</NuxtLink>
    </div>

    <div v-else class="cart-content">
      <div class="cart-items-list">
        <div
          v-for="item in cartStore.items"
          :key="item.id"
          class="cart-item-row"
        >
          <img :src="item.image" :alt="item.title" class="item-img" />

          <div class="item-details">
            <h2>{{ item.title }}</h2>
            <div class="item-price-unit">
              {{ item.price.toLocaleString() }} руб. / шт.
            </div>
          </div>

          <div class="item-quantity-controls">
            <button
              @click="cartStore.removeFromCart(item.id)"
              class="control-btn"
            >
              -
            </button>
            <span class="quantity-value">{{ item.quantity }}</span>
            <button @click="cartStore.addToCart(item)" class="control-btn">
              +
            </button>
          </div>

          <div class="item-total-cost">
            {{ (item.price * item.quantity).toLocaleString() }} руб.
          </div>
        </div>
      </div>

      <div class="cart-summary-card">
        <h2>Итого к оплате</h2>

        <div v-if="errorMessage" class="error-box-mini">
          {{ errorMessage }}
        </div>

        <div class="summary-row">
          <span>Всего товаров:</span>
          <strong>{{ cartStore.totalCount }} шт.</strong>
        </div>
        <div class="summary-row">
          <span>Общая стоимость:</span>
          <strong class="total-price-text"
            >{{ cartStore.totalPrice.toLocaleString() }} руб.</strong
          >
        </div>

        <button
          @click="handleCheckout"
          :disabled="isLoading"
          class="checkout-btn"
        >
          {{ isLoading ? "Оформление..." : "Оформить заказ" }}
        </button>
        <button @click="cartStore.clearCart" class="clear-btn">
          Очистить корзину
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cart-page {
  padding-top: 10px;
}

.page-title {
  color: #34495e;
  margin-bottom: 30px;
}

.empty-cart {
  text-align: center;
  padding: 50px 20px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px dashed #cbd5e1;
}

.empty-cart p {
  font-size: 18px;
  color: #64748b;
  margin-bottom: 20px;
}

.back-link {
  color: white;
  background: #41b883;
  text-decoration: none;
  padding: 10px 20px;
  border-radius: 6px;
  font-weight: bold;
  display: inline-block;
}

.cart-content {
  display: flex;
  gap: 30px;
  align-items: flex-start;
}

.cart-items-list {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.cart-item-row {
  display: flex;
  align-items: center;
  padding: 15px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  gap: 20px;
}

.item-img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 6px;
}

.item-details {
  flex-grow: 1;
}

.item-details h2 {
  font-size: 16px;
  color: #2c3e50;
  margin: 0 0 5px 0;
}

.item-price-unit {
  font-size: 14px;
  color: #64748b;
}

.item-quantity-controls {
  display: flex;
  align-items: center;
  gap: 12px;
}

.control-btn {
  background: #cbd5e1;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  color: #334155;
}

.control-btn:hover {
  background: #94a3b8;
}

.quantity-value {
  font-size: 16px;
  font-weight: bold;
  min-width: 20px;
  text-align: center;
}

.item-total-cost {
  font-size: 18px;
  font-weight: bold;
  color: #2c3e50;
  min-width: 120px;
  text-align: right;
}

.cart-summary-card {
  width: 350px;
  background: #f8f9fa;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 25px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.cart-summary-card h2 {
  font-size: 20px;
  color: #2c3e50;
  margin: 0;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  font-size: 15px;
  color: #475569;
}

.total-price-text {
  font-size: 20px;
  color: #2c3e50;
}

.checkout-btn {
  background: #34495e;
  color: white;
  border: none;
  padding: 14px;
  border-radius: 6px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s;
}

.checkout-btn:hover {
  background: #41b883;
}

.clear-btn {
  background: none;
  border: none;
  color: #ef4444;
  cursor: pointer;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.2s;
}

.clear-btn:hover {
  color: #6b1919;
}

@media (max-width: 768px) {
  .cart-content {
    flex-direction: column;
  }
  .cart-summary-card {
    width: 100%;
  }
  .cart-item-row {
    flex-direction: column;
    text-align: center;
  }
  .item-total-cost {
    text-align: center;
  }
}
</style>
