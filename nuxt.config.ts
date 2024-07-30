// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-07-25',
  devtools: { enabled: true },
  eslint: { config: { standalone: false } },
  routeRules: {
    '/': { prerender: true },
    '/get-video-rotation-by-mp4box-js': { redirect: { to: '/posts/get-video-rotation-by-mp4box-js', statusCode: 301 } },
    '/how_to_delete_web_service_of_synology_dsm_7_2': { redirect: { to: '/posts/how-to-delete-web-service-of-synology-dsm-7-2', statusCode: 301 } },
    '/three-small-things': { redirect: { to: '/posts/three-small-things', statusCode: 301 } },
    '/thoughts-about-growth': { redirect: { to: '/posts/thoughts-about-growth', statusCode: 301 } },
    '/shanghai-luohu': { redirect: { to: '/posts/shanghai-luohu', statusCode: 301 } },
    '/timedrotatingfilehandler-backupcount-problem': { redirect: { to: '/posts/timedrotatingfilehandler-backupcount-problem', statusCode: 301 } },
    '/gitlab-ci-auto-deploy-python-lib': { redirect: { to: '/posts/gitlab-ci-auto-deploy-python-lib', statusCode: 301 } },
    '/upgrade-ghost-5-0-to-5-42': { redirect: { to: '/posts/upgrade-ghost-5-0-to-5-42', statusCode: 301 } },
    '/use-gitlab-to-deploy-ghost-theme-automatically': { redirect: { to: '/posts/use-gitlab-to-deploy-ghost-theme-automatically', statusCode: 301 } },
  },
  modules: [
    '@nuxt/content',
    '@nuxt/eslint',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxtjs/color-mode',
    '@nuxtjs/tailwindcss',
  ],

  content: {
    documentDriven: true,
    highlight: {
      langs: ['json', 'js', 'ts', 'html', 'css', 'vue', 'shell', 'mdc', 'md', 'yaml', 'python', 'log'],
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

  colorMode: {
    classSuffix: '',
  },
})
