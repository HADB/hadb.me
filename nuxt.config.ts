// https://nuxt.com/docs/api/configuration/nuxt-config
import process from 'node:process'
import redirects from './redirects'

export default defineNuxtConfig({
  compatibilityDate: '2024-07-25',
  devtools: { enabled: false },
  eslint: { config: { standalone: false } },
  routeRules: {
    '/atom.xml': { prerender: true },
    ...redirects,
  },
  nitro: {
    prerender: {
      autoSubfolderIndex: false,
    },
  },
  css: ['artalk/dist/Artalk.css'],
  site: {
    name: 'HADB.ME',
    url: 'https://hadb.me',
  },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern', // can be removed after upgrade to vite 6
        },
      },
    },
  },
  components: [
    { path: '~/components/content', global: true },
    { path: '~/components' },
  ],
  modules: [
    '@nuxt/content',
    '@nuxt/eslint',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxt/ui',
    '@nuxtjs/color-mode',
    '@nuxtjs/plausible',
    '@nuxtjs/robots',
    '@nuxtjs/sitemap',
    '@nuxtjs/tailwindcss',
    '@sentry/nuxt/module',
  ],

  // module configs
  content: {
    build: {
      markdown: {
        highlight: {
          langs: [
            'csharp',
            'cpp',
            'css',
            'dockerfile',
            'html',
            'ini',
            'java',
            'js',
            'json',
            'kotlin',
            'log',
            'md',
            'mdc',
            'nginx',
            'php',
            'powershell',
            'python',
            'shell',
            'toml',
            'ts',
            'vue',
            'xml',
            'yaml',
          ],
          // See the available themes on https://github.com/shikijs/shiki/blob/main/docs/themes.md#all-theme
          theme: {
            dark: 'github-dark',
            default: 'github-light',
          },
        },
        remarkPlugins: { 'remark-reading-time': {} },
      },
    },
    renderer: {
      anchorLinks: false,
    },
  },

  icon: {
    serverBundle: 'auto',
  },

  colorMode: {
    preference: 'dark',
    fallback: 'dark',
    classSuffix: '',
  },

  plausible: {
    apiHost: 'https://plausible.hadb.me',
    domain: 'hadb.me',
    ignoredHostnames: [],
  },

  robots: {
    header: false,
    groups: [
      {
        userAgent: 'YisouSpider',
        disallow: '/',
      },
    ],
  },

  sitemap: {
    sitemaps: {
      pages: {
        sources: [
          '/api/__sitemap__/pages',
        ],
      },
      posts: {
        sources: [
          '/api/__sitemap__/posts',
        ],
      },
      tags: {
        sources: [
          '/api/__sitemap__/tags',
        ],
      },
    },
  },

  tailwindcss: {
    cssPath: ['~/assets/css/tailwind.css', { injectPosition: 'last' }],
  },

  sentry: {
    sourceMapsUploadOptions: {
      org: 'hadb',
      project: 'hadb-me',
      authToken: process.env.SENTRY_AUTH_TOKEN,
      telemetry: false,
    },
  },
})
