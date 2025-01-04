import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true, // Allow global `describe`, `it`, and `expect` without imports
    coverage: {    // Enable code coverage
      reporter: ['text', 'html'],
    },
  },
});