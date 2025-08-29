import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    // Create this file if you need RTL/jest-dom, mocks, etc.
    setupFiles: ['src/test/setup.ts'],
    css: true,
    // Keep E2E & generated outputs out of unit runs
    exclude: [
      'node_modules',
      'dist',
      'e2e',
      'playwright-report',
      'test-results',
      '**/*.e2e.{test,spec}.{ts,tsx,js,jsx}'
    ],
    coverage: {
      provider: 'v8',
      reports: ['text', 'html', 'lcov'],
      exclude: ['src/test/**', 'src/**/*.d.ts', 'src/**/__mocks__/**']
    },
    // Increase if DOM-heavy tests need more time
    testTimeout: 10000,
  },
});
