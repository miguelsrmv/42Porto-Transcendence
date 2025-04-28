import type { gameSettings, leanGameSettings } from '../gameSettings/gameSettings.types.js';
import { updateHUD } from '../gameSetup.js';
import { loadView } from '../../../core/viewLoader.js';

export function initializeRemoteGame(leanGameSettings: leanGameSettings) {
  const webSocket = new WebSocket('wss://padaria.42.pt/ws');

  const joinGameMsg = { type: 'join_game', playerSettings: leanGameSettings };

  const serializedJoinGameMsg = JSON.stringify(joinGameMsg);

  webSocket.onopen = () => {
    // Sends leanGameSettings
    webSocket.send(serializedJoinGameMsg);

    // Starts sending ping-pong
    setInterval(() => {
      if (webSocket.readyState === WebSocket.OPEN) {
        webSocket.send(JSON.stringify({ type: 'ping' }));
      }
    }, 30000);
  };

  webSocket.onmessage = (event) => {
    const messageData = JSON.parse(event.data);
    // If message was the first type of message, load the view and update the HUD and background
    if (messageData.type === 'game_setup') {
      const gameSettings = messageData.settings;
      // TODO: Add in a modal before?
      loadView('game-page');
      updateHUD(gameSettings, gameSettings.gameType);
      updateBackground(gameSettings.background.imagePath);
    }
    // Else if a mensagem for dados de renderização
    //{
    //renderGame(serverData);
    //}

    // Else if a mensagem for game terminou e respetivos resultados
  };
}

function updateBackground(backgroundPath: string): void {
  const backgroundImg = document.getElementById('game-background') as HTMLImageElement;
  if (!backgroundImg) {
    console.warn("Couldn't find backgroundImg element");
    return;
  }
  backgroundImg.src = backgroundPath;
}
