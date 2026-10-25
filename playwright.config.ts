import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  testMatch: '**/*.pl.tsx',
  use: {
    baseURL: 'http://127.0.0.1:4000'
  },
  webServer: {
    command: 'npm run start:test',
    url: 'http://127.0.0.1:4000',
    reuseExistingServer: false,
    timeout: 120_000,
    env: { BURGER_API_URL: 'https://norma.education-services.ru/api' }
  }
});
