import { defineConfig, devices } from '@playwright/test'

// E2E は実バックエンドに対して動かす（モックの確認は MSW のテストが担う）。
// バックエンドは隣のディレクトリ ../recruit-frontend-backend にある前提。起動済みならそれを使う
export default defineConfig({
  testDir: 'e2e',
  use: { baseURL: 'http://localhost:5173' },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: [
    {
      command: 'npm --prefix ../recruit-frontend-backend run start',
      url: 'http://localhost:3000/content',
      reuseExistingServer: true,
      timeout: 120_000,
    },
    {
      command: 'pnpm run dev',
      url: 'http://localhost:5173',
      reuseExistingServer: true,
    },
  ],
})
