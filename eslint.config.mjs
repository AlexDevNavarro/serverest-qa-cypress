import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import pluginCypress from 'eslint-plugin-cypress';
import prettierConfig from 'eslint-config-prettier';
import globals from 'globals';

export default defineConfig([
  {
    ignores: ['node_modules/', 'cypress/reports/', 'cypress/screenshots/', 'cypress/videos/'],
  },
  js.configs.recommended,
  {
    files: ['*.js', '*.mjs'],
    languageOptions: {
      globals: globals.node,
    },
  },
  {
    files: ['cypress/**/*.js'],
    extends: [pluginCypress.configs.recommended],
    languageOptions: {
      sourceType: 'module',
    },
    rules: {
      'cypress/no-force': 'error',
      'cypress/no-pause': 'error',
      'cypress/no-debug': 'error',
      'cypress/assertion-before-screenshot': 'warn',
    },
  },
  {
    rules: {
      'no-console': 'error',
      'no-var': 'error',
      'prefer-const': 'error',
      eqeqeq: ['error', 'always'],
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
  prettierConfig,
]);
