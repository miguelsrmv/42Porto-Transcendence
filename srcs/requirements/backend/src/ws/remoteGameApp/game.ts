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

function setPlayerPowerBarInterval(player: Player, GameArea: GameArea) {
  if (player.attack) player.attack.lastUsed = Date.now();

  const interval = setInterval(() => {
    if (player.attack && GameArea.runningState === gameRunningState.playing) {
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
  GameArea.intervals.push(interval);
}

function setPowerUpBar(GameArea: GameArea): void {
  setPlayerPowerBarInterval(GameArea.leftPlayer, GameArea);
  setPlayerPowerBarInterval(GameArea.rightPlayer, GameArea);
}

function closeGameHandler(socket1: WebSocket, socket2: WebSocket, GameArea: GameArea) {
  const playerLeft: ServerMessage = { type: 'player_left' };
  socket1.on('message', (message) => {
    const parsedMessage: ClientMessage = JSON.parse(message.toString());
    if (parsedMessage.type === 'stop_game') {
      GameArea.stop();
      removePlayer(socket1);
      if (socket2.readyState === WebSocket.OPEN) socket2.send(JSON.stringify(playerLeft));
      removePlayer(socket2);
    }
  });
}

function setCloseGame(player1socket: WebSocket, player2socket: WebSocket, GameArea: GameArea) {
  closeGameHandler(player1socket, player2socket, GameArea);
  closeGameHandler(player2socket, player1socket, GameArea);
}

export function initializeRemoteGame(
  player1socket: WebSocket,
  player2socket: WebSocket,
  gameSettings: gameSettings,
): void {
  const gameArea = new GameArea(player1socket, player2socket, gameSettings);
  setupInput(gameArea);
  setPowerUpBar(gameArea);
  setCloseGame(player1socket, player2socket, gameArea);
  const gameInterval = setInterval(() => {
    gameArea.gameLoop();
  }, 20);
  gameArea.intervals.push(gameInterval);
}

export async function updateGameArea(dt: number, GameArea: GameArea) {
  handleInput(GameArea);

  GameArea.leftPaddle.update(dt);
  GameArea.rightPaddle.update(dt);
  GameArea.ball.move(dt);
  GameArea.fakeBalls.forEach((fakeBall) => fakeBall.move(dt));

  checkWallCollision(GameArea.ball);
  GameArea.fakeBalls.forEach((fakeBall) => checkFakeBallWallCollision(fakeBall));
  checkPaddleCollision(GameArea);

  await checkGoal(GameArea);

  const gameState = {
    ball: GameArea.ball,
    fakeBalls: GameArea.fakeBalls,
    leftPaddle: GameArea.leftPaddle,
    rightPaddle: GameArea.rightPaddle,
    leftPowerBarFill: GameArea.leftPlayer.powerBarFill,
    rightPowerBarFill: GameArea.rightPlayer.powerBarFill,
    leftAnimation: GameArea.leftAnimation,
    rightAnimation: GameArea.rightAnimation,
  } as GameState;
  // TODO: Filter before sending
  const gameStateMsg: ServerMessage = { type: 'game_state', state: gameState };
  GameArea.broadcastSessionMessage(JSON.stringify(gameStateMsg));
}

export function getGameVersion(GameArea: GameArea): number {
  return GameArea.leftPlayer.getScore() + GameArea.rightPlayer.getScore();
}

export function endGameIfRunning(GameArea: GameArea): void {
  if (GameArea.runningState !== gameRunningState.ended) GameArea.stop();
}
