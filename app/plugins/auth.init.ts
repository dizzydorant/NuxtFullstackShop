export default defineNuxtPlugin(async (nuxtApp) => {
  const authStore = useAuthStore(nuxtApp.$pinia);

  if (process.server) {
    const cookieHeaders = useRequestHeaders(["cookie"]);

    try {
      const data = await $fetch<{ user: { id: number; email: string } | null }>(
        "/api/auth/me",
        {
          headers: cookieHeaders as Record<string, string>,
        },
      );

      if (data && data.user) {
        authStore.user = data.user;
      }
    } catch (error) {
      authStore.user = null;
    } finally {
      authStore.isChecked = true;
    }
  }
});
