import type { PlaywrightTestConfig } from '@playwright/test';
import { devices } from '@playwright/test';
import { config as dotenvConf } from 'dotenv';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
dotenvConf();
// globalSetup: process.env.CI ? undefined : require.resolve('./global-setup'),

/**
 * See https://playwright.dev/docs/test-configuration.
 */
const config: PlaywrightTestConfig = {
    globalSetup: process.env.CI ? undefined : require.resolve('./global-setup'),
    testDir: './tests',
    /* Maximum time one test can run for. */
    timeout: 100 * 1000,
    expect: {
        /**
         * Maximum time expect() should wait for the condition to be met.
         * For example in `await expect(locator).toHaveText();`
         */
        timeout: 5000,
    },
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
    /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
    use: {
        storageState: '/tmp/storage-state.json',
        ignoreHTTPSErrors: true,

        /* Maximum time each action such as `click()` can take. Defaults to 0 (no limit). */
        actionTimeout: 0,
        /* Base URL to use in actions like `await page.goto('/')`. */
        baseURL: process.env.CI ? process.env.test_link : 'https://localhost.binary.sx',

        /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
        trace: 'on-first-retry',
    },

    /* Configure projects for major browsers */
    projects: [
        {
            name: 'chromium',
            use: {
                ignoreHTTPSErrors: true,
                ...devices['Desktop Chrome'],
            },
        },

        {
            name: 'firefox',
            use: {
                ignoreHTTPSErrors: true,
                ...devices['Desktop Firefox'],
            },
        },

        {
            name: 'webkit',
            use: {
                ignoreHTTPSErrors: true,
                ...devices['Desktop Safari'],
            },
        },

        /* Test against mobile viewports. */
        // {
        //   name: 'Mobile Chrome',
        //   use: {
        //     ...devices['Pixel 5'],
        //   },
        // },
        // {
        //   name: 'Mobile Safari',
        //   use: {
        //     ...devices['iPhone 12'],
        //   },
        // },

        /* Test against branded browsers. */
        // {
        //   name: 'Microsoft Edge',
        //   use: {
        //     channel: 'msedge',
        //   },
        // },
        // {
        //   name: 'Google Chrome',
        //   use: {
        //     channel: 'chrome',
        //   },
        // },
    ],

    /* Folder for test artifacts such as screenshots, videos, traces, etc. */
    // outputDir: 'test-results/',

    /* Run your local dev server before starting the tests */
    webServer: {
        command: 'cd .. && npm run serve core',
        url: 'https://localhost.binary.sx/',
        ignoreHTTPSErrors: true,
        reuseExistingServer: true,
    },
};

export default config;
