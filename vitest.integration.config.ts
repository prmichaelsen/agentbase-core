import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['src/**/*.integ.test.ts'],
    testTimeout: 30000,
  },
})
