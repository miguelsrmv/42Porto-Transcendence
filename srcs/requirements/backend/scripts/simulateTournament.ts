import { Browser, Cookie, firefox } from 'playwright';
import https from 'https';
import WebSocket from 'ws';
import { wait } from '../src/ws/helpers';

const NUM_CLIENTS = 8;
const BASE_URL = 'https://padaria.42.pt';
const CHARACTER = {
  name: 'Mario',
  attack: 'Super Shroom',
  characterSelectPicturePath: '../../../../static/character_select/mario.png',
  characterAvatarPicturePath: '../../../../static/character_portrait/mario.png',
  accentColour: 'red',
  selectHelpMessage: "Eat one to increase your paddle's size!",
};
const MOCK_PASSWORD = '123456789';

async function simulateClient(browser: Browser, index: number) {
  const context = await browser.newContext({ ignoreHTTPSErrors: true });
  const page = await context.newPage();

  await page.goto(BASE_URL);
  await page.waitForTimeout(2000);
  await page.click('button#enter-button', { force: true });
  await page.waitForTimeout(1000);
  await page.locator('#login-email').fill(`test${index}@example.com`);
  await page.fill('#login-password', MOCK_PASSWORD);
  await page.click('button#login-submit-button');

  // Wait for localStorage ID to be set
  await page.waitForFunction(() => localStorage.getItem('ID') !== null, {}, { timeout: 5000 });

  const [playerId, host] = await Promise.all([
    page.evaluate(() => localStorage.getItem('ID')),
    page.evaluate(() => window.location.host),
  ]);

  const cookies = await context.cookies();
  const token = cookies.find((c: Cookie) => c.name === 'access_token')?.value;

  console.log(`[${index}] Logged in - ID: ${playerId}, token: ${token?.slice(0, 10)}...`);

  // Connect WebSocket
  const ws = new WebSocket(`wss://${host}/ws/tournament`, {
    agent: new https.Agent({ rejectUnauthorized: false }),
    headers: {
      cookie: `access_token=${token}`,
    },
  });
  let heartbeat: NodeJS.Timeout;
  ws.on('open', () => {
    console.log(`[${index}] WebSocket connected`);
    const joinMessage = {
      type: 'join_game',
      playerSettings: {
        playerID: playerId,
        playType: 'Tournament Play',
        gameType: 'Crazy Pong',
        alias: `test${index}`,
        paddleColour: '#ff0000',
        character: CHARACTER,
      },
    };
    ws.send(JSON.stringify(joinMessage));
    heartbeat = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: 'ping' }));
      }
    }, 20000);
  });

  ws.on('message', async (msg) => {
    const data = JSON.parse(msg.toString());
    switch (data.type) {
      case 'game_goal':
      case 'game_state': {
        return;
      }
      case 'game_end': {
        await wait(1);
        if (ws.readyState === WebSocket.OPEN)
          ws.send(JSON.stringify({ type: 'ready_for_next_game' }));
      }
    }

    console.log(`[${index}] Received:`, data);
  });

  ws.on('error', (err) => {
    console.error(`[${index}] WebSocket error:`, err.message);
  });

  ws.on('close', () => {
    console.error(`[${index}] WebSocket closed`);
    clearInterval(heartbeat);
  });
  await context.close(); // optional, closes tab and frees memory
}

(async () => {
  const browser = await firefox.launch({ headless: true });
  const clients = [];
  try {
    for (let i = 1; i <= NUM_CLIENTS; i++) {
      clients.push(await simulateClient(browser, i));
      await new Promise((res) => setTimeout(res, 300)); // stagger launch (optional)
    }
    await Promise.all(clients);
  } catch (err) {
    console.error(`Error:`, err);
  }
  await browser.close();
})().catch((err) => {
  console.error('Unhandled error in IIFE:', err);
});
