// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@nuxt/content', '@nuxt/eslint'],
  routeRules: {
    '/': { prerender: true },
  },
  eslint: {
    config: {
      standalone: false,
    },
  },
  compatibilityDate: '2024-07-25',
})
