import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['src/**/*.test.ts'],
    exclude: ['src/**/*.integ.test.ts', '**/node_modules/**'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.ts'],
      exclude: [
        'src/**/*.test.ts',
        'src/**/*.integ.test.ts',
        'src/**/index.ts',
        'src/client/api-types.generated.ts',
        'src/client/svc.ts',
        'src/client/app.ts',
        'src/test-utils/**',
        'src/services/auth.interface.ts',
      ],
      reporter: ['text', 'json-summary'],
      thresholds: {
        branches: 93,
        functions: 99,
        lines: 98,
        statements: 98,
      },
    },
  },
})
