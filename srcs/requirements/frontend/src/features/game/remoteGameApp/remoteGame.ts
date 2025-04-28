import type { gameSettings, leanGameSettings } from '../gameSettings/gameSettings.types.js';

export function initializeRemoteGame(leanGameSettings: leanGameSettings) {
  const webSocket = new WebSocket('wss://padaria.42.pt/ws');

  const joinGameMsg = { type: 'join_game', playerSettings: leanGameSettings};

  const serializedMsg = JSON.stringify(joinGameMsg);

  webSocket.onopen = (event) => {
    webSocket.send(serializedMsg);
  };

  webSocket.onmessage = (event) => {
    console.log(event.data);
  }

  // TODO: Update HUD after, only then initialize the actual
}
