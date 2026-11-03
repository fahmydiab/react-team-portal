/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    pool: 'forks', 
    server: {
      deps: {
        inline: ['react', 'react-dom', 'react-router-dom'],
      },
    },
  },
});
