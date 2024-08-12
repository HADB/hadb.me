// https://nuxt.com/docs/api/configuration/nuxt-config
import redirects from './redirects'

export default defineNuxtConfig({
  compatibilityDate: '2024-07-25',
  devtools: { enabled: false },
  eslint: { config: { standalone: false } },
  routeRules: {
    '/': { prerender: true },
    '/atom.xml': { prerender: true },
    '/sitemap.xml': { prerender: true },
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
    'nuxt-gtag',
  ],

  // module configs
  content: {
    documentDriven: true,
    highlight: {
      langs: [
        'c#',
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
    markdown: {
      remarkPlugins: ['remark-reading-time'],
      anchorLinks: false,
    },
  },

  icon: {
    serverBundle: 'auto',
  },

  colorMode: {
    preference: 'system',
    fallback: 'dark',
    classSuffix: '',
  },

  plausible: {
    apiHost: 'https://plausible.hadb.me',
    domain: 'hadb.me',
    ignoredHostnames: [],
  },

  sitemap: {
    sitemaps: {
      pages: {
        includeAppSources: true,
        exclude: [
          '/posts/**',
          '/tags/**',
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

  tailwindcss: {
    cssPath: ['~/assets/css/tailwind.css', { injectPosition: 'last' }],
    configPath: 'tailwind.config.ts',
  },

  gtag: {
    id: 'G-3D1G3C27ZZ',
  },
})
