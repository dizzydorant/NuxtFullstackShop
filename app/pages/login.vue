<script setup lang="ts">
import { ref } from "vue";

const authStore = useAuthStore();

const router = useRouter();

const email = ref("");
const password = ref("");

const isLoginMode = ref(true);

const errorMessage = ref("");
const isLoading = ref(false);

const handleSubmit = async () => {
  errorMessage.value = "";
  isLoading.value = true;

  try {
    if (isLoginMode.value) {
      await authStore.login(email.value, password.value);
    } else {
      await authStore.register(email.value, password.value);
    }

    router.push("/");
  } catch (error: any) {
    errorMessage.value =
      error.data?.statusMessage || "Произошла непредвиденная ошибка";
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="auth-page">
    <div class="auth-card">
      <h2>{{ isLoginMode ? "Войти в аккаунт" : "Регистрация" }}</h2>

      <div v-if="errorMessage" class="error-box">
        {{ errorMessage }}
      </div>

      <form @submit.prevent="handleSubmit" class="auth-form">
        <div class="form-group">
          <label for="email">Email</label>
          <input
            v-model="email"
            type="email"
            id="email"
            placeholder="example@mail.com"
            required
          />
        </div>

        <div class="form-group">
          <label for="password">Пароль</label>
          <input
            v-model="password"
            type="password"
            id="password"
            placeholder="Минимум 6 символов"
            required
          />
        </div>

        <button type="submit" :disabled="isLoading" class="submit-btn">
          {{
            isLoading
              ? "Загрузка..."
              : isLoginMode
                ? "Войти"
                : "Создать аккаунт"
          }}
        </button>
      </form>

      <div class="toggle-mode">
        <button @click="isLoginMode = !isLoginMode" class="toggle-btn">
          {{
            isLoginMode
              ? "Еще нет аккаунта? Зарегистрироваться"
              : "Уже есть аккаунт? Войти"
          }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.auth-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  font-family: sans-serif;
  background-color: #f5f7fb;
}

.auth-card {
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(149, 157, 165, 0.1);
  width: 100%;
  max-width: 400px;
}

h2 {
  margin-bottom: 24px;
  color: #2c3e50;
  text-align: center;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

label {
  font-size: 14px;
  font-weight: 600;
  color: #4a5568;
}

input {
  padding: 12px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 16px;
  transition: border-color 0.2s;
}

input:focus {
  outline: none;
  border-color: #41b883;
}

.submit-btn {
  background: #34495e;
  color: white;
  border: none;
  padding: 14px;
  border-radius: 6px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s;
  margin-top: 10px;
}

.submit-btn:hover:not(:disabled) {
  background: #41b883;
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error-box {
  background: #ffebe9;
  color: #ff3333;
  padding: 12px;
  border-radius: 6px;
  border: 1px solid #ffcccc;
  font-size: 14px;
  margin-bottom: 20px;
  text-align: center;
}

.toggle-mode {
  margin-top: 24px;
  text-align: center;
}

.toggle-btn {
  background: none;
  border: none;
  color: #41b883;
  cursor: pointer;
  font-size: 14px;
  text-decoration: underline;
}

.toggle-btn:hover {
  color: #34495e;
}
</style>
