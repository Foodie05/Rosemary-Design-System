import { defineConfig, devices } from "@playwright/test";
import path from "node:path";
export default defineConfig({
  testDir: "browser-tests",
  fullyParallel: false,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: [
    ["list"],
    [
      "html",
      {
        outputFolder: path.join(
          process.env.ROSEMARY_ARTIFACT_ROOT || path.resolve("artifacts"),
          "react/browser-report",
        ),
        open: "never",
      },
    ],
    [
      "json",
      {
        outputFile: path.join(
          process.env.ROSEMARY_ARTIFACT_ROOT || path.resolve("artifacts"),
          "react/browser-results.json",
        ),
      },
    ],
  ],
  outputDir: path.join(
    process.env.ROSEMARY_ARTIFACT_ROOT || path.resolve("artifacts"),
    "react/browser-results",
  ),
  use: {
    baseURL: "http://127.0.0.1:4173",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
  ],
  webServer: {
    command: "node server.mjs",
    url: "http://127.0.0.1:4173",
    reuseExistingServer: !process.env.CI,
    timeout: 15000,
  },
});
