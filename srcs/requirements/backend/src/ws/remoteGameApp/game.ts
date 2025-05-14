import { setupInput, handleInput } from './input.js';
import WebSocket from 'ws';
import {
  checkWallCollision,
  checkPaddleCollision,
  checkGoal,
  checkFakeBallWallCollision,
} from './collisions.js';
import { gameSettings } from './settings.js';
import { ClientMessage, gameRunningState, GameState, ServerMessage } from './types.js';
import { Player } from './player.js';
import { removePlayer } from './sessionManagement.js';
import { GameArea } from './gameArea.js';

function setPlayerPowerBarInterval(player: Player, gameArea: GameArea) {
  if (player.attack) player.attack.lastUsed = Date.now();

  const interval = setInterval(() => {
    if (player.attack && gameArea.runningState === gameRunningState.playing) {
      const lastUsed: number = player.attack.lastUsed;
      const coolDown: number = player.attack.attackCooldown;
      const currentTime: number = Date.now();

      const percentage = Math.min(((currentTime - lastUsed) * 100) / coolDown, 100);
      player.powerBarFill = percentage;

      if (percentage == 100) {
        player.attack.attackIsAvailable = true;
      }
    }
  }, 20);
  gameArea.intervals.push(interval);
}

function setPowerUpBar(gameArea: GameArea): void {
  setPlayerPowerBarInterval(gameArea.leftPlayer, gameArea);
  setPlayerPowerBarInterval(gameArea.rightPlayer, gameArea);
}

function closeGameHandler(socket1: WebSocket, socket2: WebSocket, gameArea: GameArea) {
  const playerLeft: ServerMessage = { type: 'player_left' };
  socket1.on('message', (message) => {
    const parsedMessage: ClientMessage = JSON.parse(message.toString());
    if (parsedMessage.type === 'stop_game') {
      gameArea.stop();
      removePlayer(socket1);
      if (socket2.readyState === WebSocket.OPEN) socket2.send(JSON.stringify(playerLeft));
      removePlayer(socket2);
    }
  });
}

function setCloseGame(player1socket: WebSocket, player2socket: WebSocket, gameArea: GameArea) {
  closeGameHandler(player1socket, player2socket, gameArea);
  closeGameHandler(player2socket, player1socket, gameArea);
}

export function initializeRemoteGame(
  p1id: string,
  p2id: string,
  player1socket: WebSocket,
  player2socket: WebSocket,
  gameSettings: gameSettings,
): void {
  const gameArea = new GameArea(p1id, p2id, player1socket, player2socket, gameSettings);
  setupInput(gameArea);
  setPowerUpBar(gameArea);
  setCloseGame(player1socket, player2socket, gameArea);
  const gameInterval = setInterval(() => {
    gameArea.gameLoop();
  }, 20);
  gameArea.intervals.push(gameInterval);
}

export async function updateGameArea(dt: number, gameArea: GameArea) {
  handleInput(gameArea);

  gameArea.leftPaddle.update(dt);
  gameArea.rightPaddle.update(dt);
  gameArea.ball.move(dt);
  gameArea.fakeBalls.forEach((fakeBall) => fakeBall.move(dt));

  checkWallCollision(gameArea.ball);
  gameArea.fakeBalls.forEach((fakeBall) => checkFakeBallWallCollision(fakeBall));
  checkPaddleCollision(gameArea);

  await checkGoal(gameArea);

  const gameState = {
    ball: gameArea.ball,
    fakeBalls: gameArea.fakeBalls,
    leftPaddle: gameArea.leftPaddle,
    rightPaddle: gameArea.rightPaddle,
    leftPowerBarFill: gameArea.leftPlayer.powerBarFill,
    rightPowerBarFill: gameArea.rightPlayer.powerBarFill,
    leftAnimation: gameArea.leftAnimation,
    rightAnimation: gameArea.rightAnimation,
  } as GameState;
  // TODO: Filter before sending
  const gameStateMsg: ServerMessage = { type: 'game_state', state: gameState };
  gameArea.broadcastSessionMessage(JSON.stringify(gameStateMsg));
}

export function getGameVersion(gameArea: GameArea): number {
  return gameArea.leftPlayer.getScore() + gameArea.rightPlayer.getScore();
}

export function endGameIfRunning(gameArea: GameArea): void {
  if (gameArea.runningState !== gameRunningState.ended) gameArea.stop();
}
