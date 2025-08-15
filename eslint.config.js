// ESLint flat config for v9
import js from '@eslint/js';
import globals from 'globals';

export default [
  {
    files: ['assets/**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'script',
      globals: globals.browser,
    },
    rules: {
      ...js.configs.recommended.rules,
      'no-var': 'off',
      'prefer-const': 'warn',
      'no-console': ['warn', { allow: ['error'] }],
    },
  },
];
