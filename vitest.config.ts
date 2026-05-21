import { defineConfig } from 'vitest/config';
import path from 'node:path';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/unit/**/*.test.ts'],
    setupFiles: ['tests/unit/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'json-summary', 'lcov', 'html'],
      reportsDirectory: 'coverage',
      include: ['lib/**', 'content/**'],
      exclude: [
        'lib/redirects.ts', // generated file
        'node_modules/**',
        '**/*.d.ts',
        '**/*.mdx', // MDX has YAML frontmatter — rolldown can't parse it as JS
        'tests/**',
        // scripts/ are one-shot CLI tools — invoked manually, not at runtime
      ],
      thresholds: {
        lines: 100,
        functions: 100,
        statements: 100,
        branches: 90,
      },
      // `all` was removed in vitest 4; coverage of uncovered files is now the default
    },
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, './') },
  },
});
