import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import prettier from 'eslint-config-prettier/flat'

export default tseslint.config(
  // Не проверяем артефакты сборки
  { ignores: ['dist'] },
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended, // базовые правила для JavaScript
      tseslint.configs.recommended, // правила для TypeScript
      reactHooks.configs.flat['recommended-latest'], // правила хуков React (flat config)
      reactRefresh.configs.vite, // правила для Fast Refresh (Vite)
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser, // window, document и др. глобальные браузера
    },
  },
  // Должен идти последним: выключает правила ESLint, конфликтующие с Prettier
  prettier,
)
