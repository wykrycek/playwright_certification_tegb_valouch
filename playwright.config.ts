import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

process.env.APP_LANG = process.env.APP_LANG || ''; // Nastavení výchozího jazyka pro UI testy
process.env.TEGB_URL_FRONTEND = process.env.TEGB_URL_FRONTEND || ''; // Nastavení výchozí URL frontend aplikace
process.env.TEGB_URL_BACKEND = process.env.TEGB_URL_BACKEND || ''; // Nastavení výchozí URL backend aplikace
process.env.TEGB_USERNAME = process.env.TEGB_USERNAME || ''; // Nastavení výchozího uživatelského jména pro testy
process.env.TEGB_PASSWORD = process.env.TEGB_PASSWORD || ''; // Nastavení výchozího hesla pro testy

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  // reporter: [['html', { open: 'on-failure' }], ['junit', { outputFile: 'test-results.xml' }]],
  
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: 'http://127.0.0.1:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'retain-on-failure',

    actionTimeout: 10 * 1000, // Timeout běhu akcí (click, ...)
    navigationTimeout: 30 * 1000, // Timeout navigace prohlížeče

    // ignoreHTTPSErrors: true,

    //screenshot: "only-on-failure",
    video: "retain-on-failure",

    // locale: "cs-CZ",
  },

  expect: {
    timeout: 10 * 1000, // Timeout assertů
  },

  timeout: 5 * 60 * 1000, // Timeout pro cělý běh testu

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    /* Vlastní projekt s definovaným rozlišením a dalšém nastavením */
    /*
    {
      name: 'Chrome 420x320',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 420, height: 320 },
        baseURL: 'https://playwright.dev',
        ignoreHTTPSErrors: true,
        screenshot: "only-on-failure",
        video: "retain-on-failure",
       },
    },
    */

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
