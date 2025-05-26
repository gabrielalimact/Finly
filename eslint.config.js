// eslint.config.js
const { defineConfig } = require('eslint/config')
const expoConfig = require('eslint-config-expo/flat')

module.exports = defineConfig([
  ...expoConfig,
  {
    files: ['**/*.{js,ts,jsx,tsx}'],
    ignores: ['dist/*'],
    plugins: {
      prettier: require('eslint-plugin-prettier')
    },
    rules: {
      'prettier/prettier': 'error',
      semi: ['error', 'never'], // remover ponto e vírgula
      'no-trailing-spaces': 'error', // remover espaços em branco ao final da linha
      indent: ['error', 2] // tabulação de 2 espaços
    }
  }
])
