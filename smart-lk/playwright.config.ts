import type { PlaywrightTestConfig } from '@playwright/test';
import { CONFIG_OPTIONS } from '../common/configuration/constants';
import { SmartLKBaseUrlSingleton } from './smart-lk-base-url-singleton';

const config: PlaywrightTestConfig = {
  testDir: './tests',
  /* Maximum time one test can run for. */
  timeout: CONFIG_OPTIONS.timeout,
  expect: {
    /**
     * Maximum time expect() should wait for the condition to be met.
     * For example in `await expect(locator).toHaveText();`
     */
    timeout: CONFIG_OPTIONS.locatorTimeout,
  },
  fullyParallel: CONFIG_OPTIONS.fullyParallel,
  forbidOnly: CONFIG_OPTIONS.forbidOnly,
  retries: CONFIG_OPTIONS.retries,
  //TODO - first iteration - 1 worker, 1 chromium browser
  workers: 1,
  reporter: CONFIG_OPTIONS.reporter,
  use: {
    /* Maximum time each action such as `click()` can take. Defaults to 0 (no limit). */
    actionTimeout: CONFIG_OPTIONS.actionTimeout,
    /* Maximum time each action such as `waitForURL()` can take. Defaults to 0. */
    navigationTimeout: CONFIG_OPTIONS.navigationTimeout,
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: SmartLKBaseUrlSingleton.Instance.getUrl(),
    /* See https://playwright.dev/docs/trace-viewer */
    trace: CONFIG_OPTIONS.trace,
    screenshot: CONFIG_OPTIONS.screenshot,
    headless: CONFIG_OPTIONS.headless,
    locale: CONFIG_OPTIONS.locale,
  },

  /* Configure projects for major browsers */
  projects: process.env.IS_CI_RUN
    ? [
        {
          name: 'chromium',
          use: {
            browserName: 'chromium',
          },
        },
        /*{
          name: 'playwright-webkit',
          use: {
            browserName: 'webkit',
          },
        },
        {
          name: 'playwright-firefox',
          use: {
            browserName: 'firefox',
          },
        },*/
      ]
    : [
        {
          name: 'chromium',
          use: {
            browserName: 'chromium',
          },
        },
      ],
};

export default config;
