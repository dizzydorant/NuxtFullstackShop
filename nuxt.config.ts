export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["@pinia/nuxt", "nuxt-security"],

  pinia: {
    storesDirs: ["./stores/**"],
  },

  security: {
    csrf: true,
    headers: {
      contentSecurityPolicy: {
        "img-src": [
          "'self'",
          "data:",
          "https://unsplash.com",
          "https://images.unsplash.com",
        ],
      },
      crossOriginEmbedderPolicy: "unsafe-none",
    },
  },

  runtimeConfig: {
    jwtSecret: process.env.NUXT_JWT_SECRET || "",
    public: {
      apiBase: "/api",
    },
  },
});
