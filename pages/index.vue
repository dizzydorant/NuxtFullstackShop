<script setup lang="ts">
interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  image: string;
  createdAt: string;
}

const cartStore = useCartStore();

const { data: products, error } = await useFetch<Product[]>("/api/products");
</script>

<template>
  <div>
    <h1 class="main-title">Каталог товаров</h1>

    <div v-if="error" class="error-message">
      Не удалось загрузить товары из базы данных.
    </div>

    <div v-else class="products-grid">
      <div v-for="product in products" :key="product.id" class="product-card">
        <img :src="product.image" :alt="product.title" class="product-image" />
        <div class="product-info">
          <h2>{{ product.title }}</h2>
          <p class="description">{{ product.description }}</p>
          <div class="price">{{ product.price.toLocaleString() }} руб.</div>

          <button @click="cartStore.addToCart(product)" class="buy-button">
            В корзину
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.main-title {
  margin-bottom: 20px;
  color: #34495e;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.product-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background: white;
  transition: transform 0.2s;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.product-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  background-color: #f5f5f5;
}

.product-info {
  padding: 15px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.description {
  color: #666;
  font-size: 14px;
  flex-grow: 1;
  margin-bottom: 15px;
}

.price {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 15px;
  color: #2c3e50;
}

.buy-button {
  background: #34495e;
  color: white;
  border: none;
  padding: 12px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: background 0.2s;
}

.buy-button:hover {
  background: #41b883;
}

.error-message {
  color: red;
  padding: 20px;
  border: 1px solid red;
  border-radius: 4px;
}
</style>
