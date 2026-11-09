interface User {
  id: number;
  email: string;
}

export const useAuthStore = defineStore("auth", () => {
  const user = ref<User | null>(null);
  const { $csrfFetch } = useNuxtApp();
  const isChecked = ref(false);

  const isAuthenticated = computed(() => user.value !== null);

  const register = async (email: string, password: string) => {
    const data = await $csrfFetch<{ success: boolean; user: User }>(
      "/api/auth/register",
      {
        method: "POST",
        body: { email, password },
      },
    );

    if (data.success) {
      user.value = data.user;
    }
  };

  const login = async (email: string, password: string) => {
    const data = await $csrfFetch<{ success: boolean; user: User }>(
      "/api/auth/login",
      {
        method: "POST",
        body: { email, password },
      },
    );

    if (data.success) {
      user.value = data.user;
    }
  };

  const logout = async () => {
    const data = await $csrfFetch<{ success: boolean }>("/api/auth/logout", {
      method: "POST",
    });

    if (data.success) {
      user.value = null;

      const cartStore = useCartStore();
      cartStore.clearCart();
    }
  };

  const checkSession = async () => {
    try {
      const data = await $csrfFetch<{ user: User | null }>("/api/auth/me");
      user.value = data.user;
    } catch (error) {
      user.value = null;
    } finally {
      isChecked.value = true;
    }
  };

  return {
    isChecked,
    user,
    isAuthenticated,
    register,
    login,
    logout,
    checkSession,
  };
});
