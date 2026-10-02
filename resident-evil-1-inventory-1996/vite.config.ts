/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import { configDefaults } from 'vitest/config';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  base: '/re1-1996-inventory/',
  plugins: [vue()],
  test: {
    // e2e/ holds Playwright tests, run with `npm run test:e2e`.
    exclude: [...configDefaults.exclude, 'e2e/**'],
  },
});
