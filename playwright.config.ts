import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  retries: 0,
  workers: 1,
  reporter: [['list']],
  webServer: {
    // In CI the build artifact is already downloaded into .next/ by the workflow.
    // Locally, build first if .next/ is missing.
    command: 'test -d .next && npm run start -- -p 3400 || (npm run build && npm run start -- -p 3400)',
    url: 'http://localhost:3400',
    timeout: 240_000,
    reuseExistingServer: false,
    stdout: 'pipe',
    stderr: 'pipe',
  },
  use: { baseURL: 'http://localhost:3400' },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
  ],
});
