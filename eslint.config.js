import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import security from 'eslint-plugin-security'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist', 'playground/exercises', '.claude/worktrees']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
      jsxA11y.flatConfigs.recommended,
    ],
    plugins: {
      security,
    },
    rules: {
      // Security rules — catch real vulnerabilities
      // Note: detect-object-injection disabled — too many false positives
      // on bracket notation for style/prop objects in a DS codebase.
      'security/detect-object-injection': 'off',
      'security/detect-non-literal-regexp': 'warn',
      'security/detect-unsafe-regex': 'error',
      'security/detect-buffer-noassert': 'error',
      'security/detect-eval-with-expression': 'error',
      'security/detect-no-csrf-before-method-override': 'error',
      'security/detect-possible-timing-attacks': 'warn',

      // Accessibility — jsx-a11y overrides for DS styleguide context
      // anchor-is-valid: SPA nav uses <a> with onClick handlers, no real hrefs
      'jsx-a11y/anchor-is-valid': 'warn',
      // no-autofocus: intentional in search inputs and modals
      'jsx-a11y/no-autofocus': 'off',
    },
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
  },
])
