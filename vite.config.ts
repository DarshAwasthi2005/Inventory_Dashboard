import { configDefaults, defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    environment: 'node',
    setupFiles: ['./src/test/setup.ts'],
    testTimeout: 30_000, // password hashing is intentionally slow
    exclude: [...configDefaults.exclude, 'server/**'], // the API has its own test run
  },
})