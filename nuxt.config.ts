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
  css: [
    'artalk/dist/Artalk.css',
    'lightgallery/css/lightgallery.css',
    'lightgallery/css/lg-thumbnail.css',
    'lightgallery/css/lg-video.css',
    'lightgallery/css/lg-zoom.css',
    '~/assets/styles/tailwind.css',
    '~/assets/styles/main.scss',
  ],
  site: {
    name: 'HADB.ME',
    url: 'https://hadb.me',
  },
  sourcemap: {
    client: true,
  },
  modules: [
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/ui',
    '@nuxtjs/color-mode',
    '@nuxtjs/plausible',
    '@nuxtjs/robots',
    '@nuxtjs/sitemap',
    '@sentry/nuxt/module',
    '@nuxt/content',
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
    serverBundle: 'local',
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
      'pages': {
        includeAppSources: true,
        exclude: [
          '/posts/**',
          '/moments/**',
          '/test',
        ],
      },
      'posts': {
        includeAppSources: true,
        include: [
          '/posts/**',
        ],
        exclude: [
          '/posts/tag/**',
        ],
      },
      'post-tags': {
        sources: [
          '/api/__sitemap__/post-tags',
        ],
      },
      'moments': {
        includeAppSources: true,
        include: [
          '/moments/**',
        ],
        exclude: [
          '/moments/tag/**',
        ],
      },
      'moment-tags': {
        sources: [
          '/api/__sitemap__/moment-tags',
        ],
      },
    },
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
