import { defineConfig, devices } from '@playwright/test';

// Port dédié aux tests (PORT_E2E pour en changer si npm run dev tourne déjà ailleurs).
const PORT = Number(process.env.PORT_E2E) || 4181;

export default defineConfig({
  testDir: 'tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: `http://localhost:${PORT}/`,
    ...devices['Desktop Chrome'],
  },
  webServer: {
    command: 'node outils/dev.js',
    env: { PORT: String(PORT) },
    url: `http://localhost:${PORT}/`,
    reuseExistingServer: false,
  },
});
