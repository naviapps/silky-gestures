import tseslint from 'typescript-eslint';
import globals from 'globals';
import eslint from '@eslint/js';
import importPlugin from 'eslint-plugin-import';
import reactPlugin from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import eslintConfigPrettier from 'eslint-config-prettier/flat';
import checkFile from 'eslint-plugin-check-file';

export default tseslint.config(
  {
    languageOptions: {
      globals: globals.node,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    extends: [eslint.configs.recommended],
    plugins: {
      'check-file': checkFile,
    },
    rules: {
      eqeqeq: 'error',
    },
  },
  {
    files: ['**/*.{ts,tsx}'],
    settings: {
      react: { version: 'detect' },
      'import/resolver': {
        typescript: {
          project: ['packages/react/tsconfig.json'],
        },
      },
    },
    languageOptions: {
      globals: globals.browser,
    },
    extends: [
      importPlugin.flatConfigs.recommended,
      importPlugin.flatConfigs.typescript,
      tseslint.configs.recommended,
      reactPlugin.configs.flat.recommended,
      reactPlugin.configs.flat['jsx-runtime'],
      reactHooks.configs['recommended-latest'],
      jsxA11y.flatConfigs.recommended,
      eslintConfigPrettier,
    ],
    rules: {
      'import/no-cycle': 'error',
      'linebreak-style': ['error', 'unix'],
      'react/prop-types': 'off',
      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
            'object',
          ],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
      'import/default': 'off',
      'import/no-named-as-default-member': 'off',
      'import/no-named-as-default': 'off',
      'react/react-in-jsx-scope': 'off',
      'jsx-a11y/anchor-is-valid': 'off',
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      'check-file/filename-naming-convention': [
        'error',
        {
          '**/*.{ts,tsx}': 'KEBAB_CASE',
        },
        {
          ignoreMiddleExtensions: true,
        },
      ],
    },
  },
  {
    files: ['packages/*/src/**/*'],
    rules: {
      'check-file/folder-naming-convention': [
        'error',
        {
          '**/*': 'KEBAB_CASE',
        },
      ],
    },
  },
);
