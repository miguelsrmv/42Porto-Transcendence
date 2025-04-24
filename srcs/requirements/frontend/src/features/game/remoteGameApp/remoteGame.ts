import type { gameSettings, leanGameSettings } from '../gameSettings/gameSettings.types.js';

export function initializeRemoteGame(leanGameSettings: leanGameSettings) {
  const webSocket = new WebSocket('wss://padaria.42.pt/ws');

  const serializedLeanGameSettings = JSON.stringify(leanGameSettings);

  webSocket.onopen = (event) => {
    webSocket.send(serializedLeanGameSettings);
  };

  // TODO: Update HUD after, only then initialize the actual
}
