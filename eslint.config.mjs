import antfu from '@antfu/eslint-config'
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  antfu({
    lessOpinionated: true,
    rules: {
      'style/brace-style': ['error', 'stroustrup', { allowSingleLine: false }],
      'style/arrow-parens': ['error', 'always'],
      'vue/no-multiple-template-root': 'off',
    },
    formatters: {
      css: true,
      html: true,
      prettierOptions: {
        printWidth: 160,
        endOfLine: 'auto',
        semi: false,
        singleQuote: true,
        tabWidth: 2,
        trailingComma: 'all',
        useTabs: false,
      },
    },
  }),
)
