import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  retries: 0,
  workers: 1,
  reporter: [['list']],
  webServer: {
    command: 'npm run build && npm run start -- -p 3100',
    url: 'http://localhost:3100',
    timeout: 240_000,
    reuseExistingServer: false,
    stdout: 'pipe',
    stderr: 'pipe',
  },
  use: { baseURL: 'http://localhost:3100' },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
  ],
});
