import { defineConfig } from 'vitest/config';
import path from 'node:path';

export default defineConfig({
  test: {
    environment: 'node',
    // Component tests declare `// @vitest-environment jsdom` per-file; no
    // environmentMatchGlobs needed here (and it breaks the TS-strict tsconfig).
    include: ['tests/unit/**/*.test.{ts,tsx}'],
    setupFiles: ['tests/unit/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'json-summary', 'lcov', 'html'],
      reportsDirectory: 'coverage',
      include: ['lib/**', 'content/**', 'components/**', 'app/robots.ts', 'app/sitemap.ts'],
      exclude: [
        'lib/redirects.ts', // generated file
        'node_modules/**',
        '**/*.d.ts',
        '**/*.mdx', // MDX has YAML frontmatter — rolldown can't parse it as JS
        'tests/**',
        // scripts/ are one-shot CLI tools — invoked manually, not at runtime
      ],
      thresholds: {
        // Pure utility code: keep 100 % strict.
        'lib/**': { lines: 100, functions: 100, statements: 100, branches: 90 },
        'content/**': { lines: 100, functions: 100, statements: 100, branches: 90 },
        // components/** and app/robots|sitemap have no local minimum;
        // SonarCloud's new-code gate (≥ 80 %) is the enforcer.
      },
      // `all` was removed in vitest 4; coverage of uncovered files is now the default
    },
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, './') },
  },
});
