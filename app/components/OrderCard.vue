<script setup lang="ts">
defineProps<{
  order: any;
}>();

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
  <div class="order-card">
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
      <div v-for="item in order.items" :key="item.id" class="order-item-row">
        <img
          :src="item.product?.image || 'https://unsplash.com'"
          class="item-mini-img"
        />
        <div class="item-mini-details">
          <span class="item-mini-title">{{
            item.product?.title || "Товар удален"
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
</template>

<style scoped>
.order-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 20px;
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
</style>
