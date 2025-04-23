import type { gameSettings } from '../gameSettings/gameSettings.types.js';

export function initializeRemoteGame(gameSettings: gameSettings) {
  const webSocket = new WebSocket('wss://padaria.42.pt/ws');

  const serializedGameSettings = JSON.stringify(gameSettings);

  webSocket.onopen = (event) => {
    webSocket.send(serializedGameSettings);
  };
}
