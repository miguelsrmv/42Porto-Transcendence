import { Browser, firefox } from 'playwright';

const NUM_CLIENTS = 8;
const BASE_URL = 'https://padaria.42.pt';
const MOCK_PASSWORD = '123456789';

async function simulateClient(browser: Browser, index: number) {
  const context = await browser.newContext({ ignoreHTTPSErrors: true });
  const page = await context.newPage();

  await page.goto(BASE_URL);
  await page.waitForSelector('#enter-button', { timeout: 5000 });
  await page.click('button#enter-button', { force: true });
  await page.waitForSelector('#login-email', { timeout: 5000 });
  await page.fill('#login-email', `test${index}@example.com`);
  await page.fill('#login-password', MOCK_PASSWORD);
  await page.click('button#login-submit-button');
}

void (async () => {
  const browser = await firefox.launch({ headless: false });
  try {
    for (let i = 1; i <= NUM_CLIENTS; i++) {
      void simulateClient(browser, i);
      await new Promise((res) => setTimeout(res, 300)); // optional delay
    }

    console.log(`All ${NUM_CLIENTS} clients launched. Tabs will stay open.`);
    await new Promise(() => {});
  } catch (err) {
    console.error(`Error:`, err);
    await browser.close();
  }
})();
