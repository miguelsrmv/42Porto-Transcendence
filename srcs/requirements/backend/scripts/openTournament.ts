import { Browser, firefox } from 'playwright';

const NUM_CLIENTS = 8;
const BASE_URL = 'https://padaria.42.pt';
const MOCK_PASSWORD = '123456789';

async function simulateClient(browser: Browser, index: number) {
  const context = await browser.newContext({ ignoreHTTPSErrors: true });
  const page = await context.newPage();

  await page.goto(BASE_URL);
  await page.waitForTimeout(1000);
  await page.click('button#enter-button', { force: true });
  await page.waitForTimeout(500);
  await page.fill('#login-email', `test${index}@example.com`);
  await page.fill('#login-password', MOCK_PASSWORD);
  await page.click('button#login-submit-button');

  await page.waitForFunction(() => localStorage.getItem('ID') !== null, {}, { timeout: 5000 });

  await page.click('button#tournament-play-button');
  await page.waitForTimeout(500);
  await page.click('crazy-pong-button');

  // Don't close context or tab
}

void (async () => {
  const browser = await firefox.launch({ headless: false });
  try {
    for (let i = 1; i <= NUM_CLIENTS; i++) {
      void simulateClient(browser, i); // Don't await so they run concurrently
      await new Promise((res) => setTimeout(res, 300)); // optional delay
    }

    console.log(`All ${NUM_CLIENTS} clients launched. Tabs will stay open.`);
    await new Promise(() => {}); // Keep the script alive
  } catch (err) {
    console.error(`Error:`, err);
    await browser.close();
  }
})();
