<script setup lang="ts">
const model = defineModel<number>({ required: true });

defineProps<{
  totalPages: number;
}>();
</script>

<template>
  <div v-if="totalPages > 1" class="pagination-controls">
    <button @click="model--" :disabled="model === 1" class="page-btn arrow-btn">
      &larr; Назад
    </button>

    <div class="page-numbers">
      <button
        v-for="page in totalPages"
        :key="page"
        @click="model = page"
        :class="['page-btn', { active: model === page }]"
      >
        {{ page }}
      </button>
    </div>

    <button
      @click="model++"
      :disabled="model === totalPages"
      class="page-btn arrow-btn"
    >
      Вперед &rarr;
    </button>
  </div>
</template>

<style scoped>
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
