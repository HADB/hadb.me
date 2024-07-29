import colors from 'tailwindcss/colors'
import typography from '@tailwindcss/typography'

const round = (num: number) =>
  num
    .toFixed(7)
    .replace(/(\.\d+?)0+$/, '$1')
    .replace(/\.0$/, '')
const em = (px: number, base: number) => `${round(px / base)}em`

export default {
  darkMode: 'class',
  plugins: [
    typography(),
  ],
  theme: {
    extend: {
      colors: {
        primary: colors.emerald,
      },
      typography: () => ({
        DEFAULT: {
          css: {
            h1: {
              fontSize: em(24, 16),
              marginTop: '0',
              marginBottom: em(32, 36),
              lineHeight: round(40 / 24),
            },
            h2: {
              fontSize: em(20, 16),
              marginTop: em(48, 24),
              marginBottom: em(20, 24),
              lineHeight: round(32 / 20),
            },
            h3: {
              fontSize: em(18, 16),
              marginTop: em(32, 20),
              marginBottom: em(12, 20),
              lineHeight: round(32 / 18),
            },
            h4: {
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
