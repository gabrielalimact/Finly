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
      semi: ['error', 'never'],
      'no-trailing-spaces': 'error',
      indent: ['error', 2],
      'space-in-parens': ['error', 'never', { exceptions: ['empty'] }],
      'array-bracket-spacing': [
        'error',
        'never',
        {
          singleValue: false,
          objectsInArrays: false,
          arraysInArrays: false,
          empty: 'always'
        }
      ],
      'object-curly-spacing': [
        'error',
        'never',
        { objectsInObjects: false, arraysInObjects: false, empty: 'always' }
      ]
    }
  }
])
