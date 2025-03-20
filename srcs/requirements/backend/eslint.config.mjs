import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';

export default tseslint.config(
  eslint.configs.recommended, // Base ESLint rules
  tseslint.configs.recommended, // TypeScript ESLint rules
  prettier, // Disables ESLint rules that conflict with Prettier
  {
    ignores: ['**/*.d.ts'], // Ignore .d.ts files
  },
  {
    files: ['src/**/*.ts'], // Only check .ts files inside src/
  },
  {
    plugins: { prettier: prettierPlugin }, // Enable Prettier as an ESLint plugin
    rules: {
      'prettier/prettier': 'warn', // Show Prettier issues as warnings
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      'no-console': 'warn',
    },
  },
);
