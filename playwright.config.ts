import { defineConfig, devices } from "@playwright/test";

// Base URL: override with PW_BASE_URL to point at dev server instead of preview
const BASE_URL = (process.env.PW_BASE_URL || "http://127.0.0.1:4173").replace(
  /\/+$/,
  ""
);

export default defineConfig({
  testDir: "e2e",
  testMatch: ["**/tests/**/*.ts"],
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [["list"], ["html", { open: "never" }]],

  // Global expectations
  expect: {
    timeout: 7_000,
    toHaveScreenshot: {
      // Keep diffs lenient enough to pass across Linux/CI font/hinting quirks
      maxDiffPixelRatio: 0.01,
    },
  },

  // Put baseline screenshots into e2e/__screenshots__/{project}/{testPath}/{name}.png
  snapshotPathTemplate:
    "{testDir}/__screenshots__/{projectName}/{testFilePath}/{arg}{ext}",

  use: {
    baseURL: BASE_URL,
    trace: process.env.CI ? "on-first-retry" : "retain-on-failure",
    video: process.env.CI ? "retain-on-failure" : "off",
    screenshot: "only-on-failure",
    locale: "en-IN",
    viewport: { width: 1280, height: 800 },
    // Helpful to stabilize pixels if you don't do it in tests
    launchOptions: {
      args: ["--no-sandbox", "--disable-dev-shm-usage"],
    },
  },

  // Projects: run Chromium by default. Uncomment others as needed.
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    // {
    //   name: "firefox",
    //   use: { ...devices["Desktop Firefox"] },
    // },
    // {
    //   name: "webkit",
    //   use: { ...devices["Desktop Safari"] },
    // },
  ],

  // Local server: uses Vite preview. If PW_BASE_URL is set, we reuse that and skip starting a server.
  webServer: process.env.PW_BASE_URL
    ? undefined
    : [
        {
          command: "npm run build && npx vite preview --port 4173 --strictPort",
          url: BASE_URL,
          reuseExistingServer: true,
          timeout: 120_000,
          stdout: "pipe",
          stderr: "pipe",
        },
      ],
});
