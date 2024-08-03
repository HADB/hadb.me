// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-07-25',
  devtools: { enabled: true },
  eslint: { config: { standalone: false } },
  routeRules: {
    '/': { prerender: true },
    '/sitemap.xml': { prerender: true },
    '/how_to_delete_web_service_of_synology_dsm_7_2': { redirect: { to: '/posts/how-to-delete-web-service-of-synology-dsm-7-2', statusCode: 301 } },
  },
  modules: [
    '@nuxt/content',
    '@nuxt/eslint',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxtjs/color-mode',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/sitemap',
  ],

  content: {
    documentDriven: true,
    highlight: {
      langs: [
        'css',
        'dockerfile',
        'html',
        'js',
        'json',
        'kotlin',
        'log',
        'md',
        'mdc',
        'python',
        'shell',
        'toml',
        'ts',
        'vue',
        'yaml',
      ],
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

  sitemap: {
    sitemaps: {
      pages: {
        includeAppSources: true,
        exclude: [
          '/posts/**',
          '/test',
        ],
      },
      posts: {
        includeAppSources: true,
        include: [
          '/posts/**',
        ],
      },
      tags: {
        sources: [
          '/api/__sitemap__/tags',
        ],
      },
    },
  },
})
