import colors from 'tailwindcss/colors'
import type { Config } from 'tailwindcss'
import typography from '@tailwindcss/typography'

const round = (num: number) => num.toFixed(7)
const em = (px: number, base: number) => `${round(px / base)}em`
const rem = (px: number) => `${round(px / 16)}rem`

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
            '--tw-prose-links': theme('colors.primary.500'),
            '--tw-prose-invert-links': theme('colors.primary.400'),
            '--tw-prose-borders': theme('colors.slate.200'),
            '--tw-prose-invert-borders': theme('colors.slate.700'),
          },
        },
        invert: {
          css: {
            '--tw-prose-borders': 'var(--tw-prose-invert-borders)',
          },
        },
        DEFAULT: {
          css: {
            'blockquote p:first-of-type::before': false,
            'blockquote p:first-of-type::after': false,
            'a': {
              'textDecoration': 'none',
              'borderBottomWidth': '1px',
              'borderStyle': 'solid',
              'color': 'inherit',
              'borderColor': 'currentcolor',
              '&:hover': {
                color: 'var(--tw-prose-links)',
                borderColor: 'var(--tw-prose-links)',
              },
            },
            'p': {
              textAlign: 'justify',
              overflowWrap: 'break-word',
            },
            'code': {
              overflowWrap: 'break-word',
            },
            'li': {
              textAlign: 'justify',
              overflowWrap: 'break-word',
            },
            'img': {
              'borderRadius': rem(6),
              'outlineStyle': 'solid',
              'outlineWidth': '1px',
              'outlineColor': 'var(--tw-prose-borders)',
              'maxWidth': '100%',
              'marginLeft': 'auto',
              'marginRight': 'auto',
              '&[alt="cover"]': {
                width: '100%',
              },
            },
            'h1': {
              fontSize: em(24, 16),
              marginTop: '0',
              marginBottom: em(24, 24), // 24px
              lineHeight: 1.5,
            },
            'h2': {
              fontSize: em(20, 16),
              marginTop: em(36, 20), // 36px
              marginBottom: em(24, 20), // 24px
              lineHeight: 1.5,
            },
            'h3': {
              fontSize: em(18, 16),
              marginTop: em(24, 18), // 24px
              marginBottom: em(24, 18), // 24px
              lineHeight: 1.5,
            },
            'h4': {
              fontSize: em(16, 16),
              marginTop: em(24, 16), // 24px
              marginBottom: em(24, 16), // 24px
              lineHeight: 1.5,
            },
          },
        },
      }),
    },
  },
}
