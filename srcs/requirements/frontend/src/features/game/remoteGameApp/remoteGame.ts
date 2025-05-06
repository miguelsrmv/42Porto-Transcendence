/**
 * @file remoteGame.ts
 * @brief Manages the setup and control of remote games using WebSockets.
 *
 * This file contains functions to initialize and manage remote games, including sending
 * and receiving messages via WebSocket to control game flow and player interactions.
 */

import type { gameSettings, leanGameSettings } from '../gameSettings/gameSettings.types.js';
import { updateHUD } from '../gameSetup.js';
import { loadView } from '../../../core/viewLoader.js';
import { updateBackground, renderGame } from './renderGame.js';
import { triggerEndGameMenu } from '../gameStats/gameConclusion.js';

/**
 * @brief Indicates whether a game is currently running.
 */
let gameIsRunning: boolean = false;

/**
 * @brief WebSocket connection for the remote game.
 */
let webSocket: WebSocket;

/**
 * @brief Initializes a remote game with the given settings.
 *
 * This function establishes a WebSocket connection to the game server, sends the initial
 * game settings, and sets up event handlers for game messages and player input.
 *
 * @param leanGameSettings The settings for the game, including player preferences and game type.
 */
export function initializeRemoteGame(leanGameSettings: leanGameSettings) {
  webSocket = new WebSocket('wss://padaria.42.pt/ws');

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
    console.log(`Got a message! ${JSON.stringify(messageData)}`);
    if (messageData.type === 'game_setup') {
      const gameSettings = messageData.settings;
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
      gameIsRunning = true;
      renderGame(webSocket);
    } else if (messageData.type === 'game_end') {
      gameIsRunning = false;
      triggerEndGameMenu(
        messageData.winningPlayer,
        messageData.ownSide,
        messageData.stats,
        'Remote Play', // TODO: replace by messageData.playType
      );
    }
  };
}

/**
 * @brief Ends the remote game if it is currently running.
 *
 * This function sends a stop message to the server to terminate the game session.
 */
export function endRemoteGameIfRunning(): void {
  const stopMessage = JSON.stringify({ type: 'stop_game' });
  if (gameIsRunning) {
    webSocket.send(stopMessage);
  }
}
