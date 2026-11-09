<script setup lang="ts">
defineProps<{
  email: string | undefined;
  id: number | undefined;
}>();
</script>

<template>
  <div class="user-info-card">
    <div class="user-avatar">👤</div>
    <div class="user-details">
      <h2>Ваш аккаунт</h2>
      <p class="user-email">
        Email: <strong>{{ email }}</strong>
      </p>
      <p class="user-id">
        ID пользователя в базе: <code>#{{ id }}</code>
      </p>
    </div>
  </div>
</template>

<style scoped>
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
</style>
