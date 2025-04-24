import type { gameSettings, leanGameSettings } from '../gameSettings/gameSettings.types.js';

export function initializeRemoteGame(gameSettings: leanGameSettings) {
  const webSocket = new WebSocket('wss://padaria.42.pt/ws');

  const serializedGameSettings = JSON.stringify(gameSettings);

  // TODO: Also send ID
  // TODO: Send leaner gameSettings
  webSocket.onopen = (event) => {
    webSocket.send(serializedGameSettings);
  };
}
