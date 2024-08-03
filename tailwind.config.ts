import colors from 'tailwindcss/colors'
import type { Config } from 'tailwindcss'
import typography from '@tailwindcss/typography'

const round = (num: number) => num.toFixed(2)
const em = (px: number, base: number) => `${round(px / base)}em`

export default <Partial<Config>> {
  content: [
    'components/**/*.{vue,js,ts}',
    'layouts/**/*.vue',
    'pages/**/*.vue',
    'composables/**/*.{js,ts}',
    'plugins/**/*.{js,ts}',
    'app.{js,ts,vue}',
    'error.{js,ts,vue}',
    'content/**/*.md',
  ],
  darkMode: 'class',
  plugins: [typography],
  theme: {
    extend: {
      colors: {
        primary: colors.emerald,
      },
      typography: ({ theme }: { theme: (k: string) => string }) => ({
        slate: {
          css: {
            '--tw-prose-pre-bg': theme('colors.slate.100'),
            '--tw-prose-invert-pre-bg': theme('colors.slate.900'),
          },

        },
        DEFAULT: {
          css: {
            'blockquote p:first-of-type::before': false,
            'blockquote p:first-of-type::after': false,
            'h1': {
              fontSize: em(24, 16),
              marginTop: '0',
              marginBottom: em(32, 36),
              lineHeight: round(40 / 24),
            },
            'h2': {
              fontSize: em(20, 16),
              marginTop: em(48, 24),
              marginBottom: em(20, 24),
              lineHeight: round(32 / 20),
            },
            'h3': {
              fontSize: em(18, 16),
              marginTop: em(32, 20),
              marginBottom: em(12, 20),
              lineHeight: round(32 / 18),
            },
            'h4': {
              fontSize: em(16, 16),
              marginTop: em(24, 16),
              marginBottom: em(8, 16),
              lineHeight: round(24 / 16),
            },
          },
        },
      }),
    },
  },
}
