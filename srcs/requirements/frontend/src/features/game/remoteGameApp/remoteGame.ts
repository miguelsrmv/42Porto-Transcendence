/**
 * @file remoteGame.ts
 * @brief Manages the setup and control of remote games using WebSockets.
 *
 * This file contains functions to initialize and manage remote games, including sending
 * and receiving messages via WebSocket to control game flow and player interactions.
 */

import type { leanGameSettings, gameType } from '../gameSettings/gameSettings.types.js';
import { updateHUD } from '../gameSetup.js';
import { loadView } from '../../../core/viewLoader.js';
import {
  updateBackground,
  startGameArea,
  renderGame,
  renderGoal,
  resetVariables,
} from './renderGame.js';
import { triggerEndGameMenu } from '../gameStats/gameConclusion.js';
import { showTournamentStatus } from '../../../ui/tournamentStatus/tournamentStatus.js';

/**
 * @brief Indicates whether a game or tournamet is currently running.
 *
 * These variables are used to track the state of the game and ensure proper handling
 * of game-related events and WebSocket communication.
 */
let gameIsRunning: boolean = false;
let tournamentIsRunning: boolean = false;

/**
 * @brief WebSocket connection for the remote game.
 *
 * This WebSocket instance is used to communicate with the game server, sending and
 * receiving messages to manage the game state and player interactions.
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
  if (leanGameSettings.playType === 'Remote Play')
    webSocket = new WebSocket(`wss:/${window.location.host}/ws`);
  else webSocket = new WebSocket(`wss:/${window.location.host}/ws/tournament`);

  const joinGameMsg = { type: 'join_game', playerSettings: leanGameSettings };

  const serializedJoinGameMsg = JSON.stringify(joinGameMsg);

  webSocket.onopen = () => {
    webSocket.send(serializedJoinGameMsg);
    setInterval(() => {
      if (webSocket.readyState === WebSocket.OPEN) {
        webSocket.send(JSON.stringify({ type: 'ping' }));
      }
    }, 30000);
  };

  window.addEventListener(
    'popstate',
    () => {
      stopGame();
    },
    {
      once: true,
    },
  );

  window.addEventListener('beforeunload', (event) => {
    stopGame();
    event.preventDefault();
    event.returnValue = '';
  });

  webSocket.onmessage = (event) => {
    const messageData = JSON.parse(event.data);
    console.log('I got', messageData);
    if (messageData.type === 'game_setup') {
      const gameSettings = messageData.settings;
      loadView('game-page');
      updateHUD(gameSettings, gameSettings.gameType);
      updateBackground(gameSettings.background.imagePath);
      addKeyEventListeners(gameSettings.gameType);
      if (gameSettings.playType === 'Tournament Play') tournamentIsRunning = true;
    } else if (messageData.type === 'game_start') {
      gameIsRunning = true;
      startGameArea();
    } else if (messageData.type === 'game_state' && gameIsRunning) {
      renderGame(messageData);
    } else if (messageData.type === 'game_goal' && gameIsRunning) {
      renderGoal(messageData.scoringSide);
    } else if (
      (messageData.type === 'game_end' || messageData.type === 'tournament_end') &&
      gameIsRunning
    ) {
      gameIsRunning = false;
      if (messageData.type === 'tournament_end') tournamentIsRunning = false;
      triggerEndGameMenu(
        messageData.winningPlayer,
        messageData.ownSide,
        messageData.stats,
        leanGameSettings.playType,
        tournamentIsRunning,
      );
      resetVariables();
      webSocket.close();
    } else if (messageData.type === 'tournament_status') {
      showTournamentStatus(messageData.participants);
    }
  };
}

function stopGame(): void {
  const stopMessage = JSON.stringify({ type: 'stop_game' });

  if (gameIsRunning) {
    gameIsRunning = false;
    setTimeout(() => {
      if (webSocket.readyState === WebSocket.OPEN) {
        webSocket.close();
      }
    }, 100);
  } else if (webSocket.readyState === WebSocket.OPEN) {
    webSocket.close();
    webSocket.send(stopMessage);
  }
}

/**
 * @brief Adds event listeners for keyboard input during the game.
 *
 * This function sets up handlers for keydown and keyup events to send
 * movement and action commands to the server based on the player's input.
 *
 * @param gameType The type of the game, which determines specific key actions.
 */
function addKeyEventListeners(gameType: gameType): void {
  const keyDownHandler = (e: KeyboardEvent) => {
    if (e.key === ' ' && gameType === 'Crazy Pong') {
      webSocket.send(JSON.stringify({ type: 'power_up' }));
    } else if (e.key == 'ArrowUp') {
      webSocket.send(JSON.stringify({ type: 'movement', direction: 'up' }));
    } else if (e.key == 'ArrowDown') {
      webSocket.send(JSON.stringify({ type: 'movement', direction: 'down' }));
    }
  };

  const keyUpHandler = (e: KeyboardEvent) => {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      webSocket.send(JSON.stringify({ type: 'movement', direction: 'stop' }));
      console.log('Stopped sending input');
    }
  };

  window.addEventListener('keydown', keyDownHandler);
  window.addEventListener('keyup', keyUpHandler);
}
