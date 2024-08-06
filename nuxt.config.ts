// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-07-25',
  devtools: { enabled: true },
  eslint: { config: { standalone: false } },
  routeRules: {
    '/': { prerender: true },
    '/atom.xml': { prerender: true },
    '/sitemap.xml': { prerender: true },
    '/how_to_delete_web_service_of_synology_dsm_7_2': { redirect: { to: '/posts/how-to-delete-web-service-of-synology-dsm-7-2', statusCode: 301 } },
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
    '@nuxtjs/color-mode',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/sitemap',
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
        'js',
        'json',
        'kotlin',
        'log',
        'md',
        'mdc',
        'nginx',
        'php',
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
    clientBundle: {
      icons: [
        'material-symbols:dark-mode-rounded',
        'material-symbols:light-mode-rounded',
        'uil:desktop',
        'uil:github',
      ],
    },
  },

  colorMode: {
    preference: 'system',
    fallback: 'dark',
    classSuffix: '',
  },

  tailwindcss: {
    cssPath: ['~/assets/css/tailwind.css', { injectPosition: 'last' }],
    configPath: 'tailwind.config.ts',
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
