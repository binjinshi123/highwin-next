import tseslint from '@electron-toolkit/eslint-config-ts'
import pluginReact from 'eslint-plugin-react'

export default tseslint.config(
  tseslint.configs.recommended, // Electron + TypeScript 推荐规则
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/out/**',
      '.gitignore',
      'src/renderer/src/components/ui'
    ]
  },
  {
    files: ['**/*.{jsx,tsx}'],
    plugins: { react: pluginReact },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: { jsx: true }
      }
    },
    rules: {
      'react/jsx-uses-react': 'off', // React 17+ 可关闭
      'react/react-in-jsx-scope': 'off' // React 17+ 可关闭
    }
  }
)
