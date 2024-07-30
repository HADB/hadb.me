// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-07-25',
  devtools: { enabled: true },
  eslint: { config: { standalone: false } },
  routeRules: {
    '/': { prerender: true },
    '/get-video-rotation-by-mp4box-js': { redirect: { to: '/posts/get-video-rotation-by-mp4box-js', statusCode: 301 } },
    '/how_to_delete_web_service_of_synology_dsm_7_2': { redirect: { to: '/posts/how-to-delete-web-service-of-synology-dsm-7-2', statusCode: 301 } },
  },
  modules: [
    '@nuxt/content',
    '@nuxt/eslint',
    '@nuxt/icon',
    '@nuxtjs/color-mode',
    '@nuxtjs/tailwindcss',
  ],

  content: {
    documentDriven: true,
    highlight: {
      // See the available themes on https://github.com/shikijs/shiki/blob/main/docs/themes.md#all-theme
      theme: {
        dark: 'github-dark',
        default: 'github-light',
      },
    },
    markdown: {
      remarkPlugins: ['remark-reading-time'],
      anchorLinks: false,
    },

  },
  colorMode: {
    classSuffix: '',
  },
  icon: {
    serverBundle: 'auto',
    clientBundle: {
      icons: [
        'uil:moon',
        'uil:sun',
        'uil:desktop',
        'uil:github',
      ],
    },
  },
})
