import type { gameSettings, leanGameSettings } from '../gameSettings/gameSettings.types.js';
import { updateHUD } from '../gameSetup.js';

export function initializeRemoteGame(leanGameSettings: leanGameSettings) {
  const webSocket = new WebSocket('wss://padaria.42.pt/ws');

  const joinGameMsg = { type: 'join_game', playerSettings: leanGameSettings };

  const serializedMsg = JSON.stringify(joinGameMsg);

  webSocket.onopen = () => {
    webSocket.send(serializedMsg);
  };

  webSocket.onmessage = (event) => {
    const messageData = JSON.parse(event.data);
    if (messageData.type === 'game_setup') {
      const gameSettings = messageData;
      updateHUD(gameSettings, gameSettings.gameType);
      updateBackground(gameSettings.background.imagePath);
    }
    // If a mensagem for game settings
    //const gameSettings = JSON.parse(event.data);
    // Else if a mensagem for dados de renderização

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
