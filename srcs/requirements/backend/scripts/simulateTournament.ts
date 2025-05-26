import puppeteer from 'puppeteer';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const NUM_CLIENTS = 1;
const BASE_URL = 'https://padaria.42.pt';
const CHARACTER = {
  name: 'Mario',
  attack: 'Super Shroom',
  characterSelectPicturePath: '../../../../static/character_select/mario.png',
  characterAvatarPicturePath: '../../../../static/character_portrait/mario.png',
  accentColour: 'red',
  selectHelpMessage: "Eat one to increase your paddle's size!",
};
const SETTINGS = {
  playerID: 'd0a58832-e2ce-4cfa-91de-8eba2816e8fd',
  playType: 'Tournament Play',
  gameType: 'Crazy Pong',
  alias: 'ana123',
  paddleColour: '#ff0000',
  character: CHARACTER,
};
const MOCK_PASSWORD = '123456789';

async function simulateClient(index: number) {
  const browser = await puppeteer.launch({
    headless: false, // change to true if you don't want UI
    args: ['--no-sandbox'],
  });

  const page = await browser.newPage();

  try {
    // Navigate to login page and perform login
    await page.goto(`${BASE_URL}/#login`);

    // Simulate form input (if your frontend has login UI)
    await page.type('input[name="email"]', `test${index}@example.com`);
    await page.type('input[name="password"]', MOCK_PASSWORD);
    await page.click('button[type="submit"]');

    // Wait for navigation or successful login indicator
    await page.waitForNavigation({ timeout: 5000 }).catch(() => {});
    console.log(`Client ${index}: Logged in`);

    // Inject code to connect to WebSocket
    await page.evaluate(() => {
      const ws = new WebSocket(`ws://${window.location.host}/ws/tournament`);

      ws.onopen = () => {
        console.log('Connected to tournament');
        ws.send(JSON.stringify({ type: 'join_game', playerSettings: SETTINGS }));
      };

      ws.onmessage = (event) => {
        console.log('Received from server:', event.data);
      };

      ws.onerror = (err) => {
        console.error('WebSocket error:', err);
      };

      ws.onclose = () => {
        console.log('WebSocket closed');
      };
    });

    // Keep client connected
    await new Promise((resolve) => setTimeout(resolve, 10000));
  } catch (error) {
    console.error(`Client ${index} failed:`, error);
  } finally {
    await browser.close();
  }
}

(async () => {
  const clients = Array.from({ length: NUM_CLIENTS }, (_, i) => simulateClient(i + 1));
  await Promise.all(clients);
})();
