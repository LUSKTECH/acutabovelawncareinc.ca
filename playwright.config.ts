import { defineConfig, devices } from '@playwright/test';

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3400';

// Parse the port from the baseURL so webServer always matches.
const port = new URL(baseURL).port || '3400';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  retries: 0,
  workers: 1,
  reporter: [['list']],
  webServer: {
    // In CI the build artifact is already downloaded into .next/ by the workflow.
    // Locally, build first if .next/ is missing.
    command: `test -d .next && npm run start -- -p ${port} || (npm run build && npm run start -- -p ${port})`,
    url: baseURL,
    timeout: 240_000,
    // When PLAYWRIGHT_BASE_URL is set (pointing at an already-running server),
    // reuse it rather than spawning a new one.
    reuseExistingServer: !!process.env.PLAYWRIGHT_BASE_URL,
    stdout: 'pipe',
    stderr: 'pipe',
  },
  use: { baseURL },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
  ],
});
