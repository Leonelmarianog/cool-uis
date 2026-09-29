import { defineConfig, devices } from '@playwright/test';

// A port of its own, so the tests never reuse a dev server started by hand.
const PORT = 5174;

export default defineConfig({
  testDir: './e2e',
  use: {
    baseURL: `http://localhost:${PORT}`,
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        // Software WebGL, so CHECK's 3D model renders without a GPU.
        launchOptions: { args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader'] },
      },
    },
  ],
  webServer: {
    command: `npm run dev -- --port ${PORT} --strictPort`,
    url: `http://localhost:${PORT}`,
  },
});
