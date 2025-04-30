import type { gameSettings, leanGameSettings } from '../gameSettings/gameSettings.types.js';
import { updateHUD } from '../gameSetup.js';
import { loadView } from '../../../core/viewLoader.js';
import { updateBackground, renderGame } from './renderGame.js';

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
    console.log(`I got as a message ${JSON.stringify(messageData)}`);
    if (messageData.type === 'game_setup') {
      const gameSettings = messageData.settings;
      // TODO: Add in a modal before?
      loadView('game-page');
      updateHUD(gameSettings, gameSettings.gameType);
      updateBackground(gameSettings.background.imagePath);

      const keyDownHandler = (e: KeyboardEvent) => {
        if (e.key === ' ' && gameSettings.gameType === 'Crazy Pong') {
          webSocket.send(JSON.stringify({ type: 'power_up' }));
        } else if (e.key == 'ArrowUp') {
          webSocket.send(JSON.stringify({ type: 'movement', direction: 'up' }));
        } else if (e.key == 'ArrowDown') {
          webSocket.send(JSON.stringify({ type: 'movement', direction: 'down' }));
        }
      };

      const keyUpHandler = (e: KeyboardEvent) => {
        // Send Stop
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
          webSocket.send(JSON.stringify({ type: 'movement', direction: 'stop' }));
          console.log('Stopped sending input');
        }
      };

      window.addEventListener('keydown', keyDownHandler);
      window.addEventListener('keyup', keyUpHandler);
    } else if (messageData.type === 'game_start') {
      // TODO: Change to game start??
      renderGame(webSocket);
    }
    // Else if a mensagem for game terminou e respetivos resultados
  };
}
