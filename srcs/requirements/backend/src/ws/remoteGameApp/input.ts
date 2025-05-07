import { GameArea, SPEED } from './gameArea.js';
import { Player } from './player.js';
import { gameRunningState, PlayerInput } from './types.js';
import WebSocket from 'ws';

// Set player input based on client message
function setupPlayerInput(socket: WebSocket, player: Player): void {
  player.socket.on('message', (message) => {
    const parsedMessage = JSON.parse(message.toString());
    if (parsedMessage.type === 'movement') {
      player.input = parsedMessage.direction as PlayerInput;
    } else if (parsedMessage.type === 'power_up') {
      player.attack?.attack();
    }
  });
}

export function setupInput(gameArea: GameArea): void {
  setupPlayerInput(gameArea.leftPlayer.socket, gameArea.leftPlayer);
  setupPlayerInput(gameArea.rightPlayer.socket, gameArea.rightPlayer);
}

// Update paddle movement based on player input
function handlePlayerInput(player: Player): void {
  if (player.input === PlayerInput.up) {
    player.ownPaddle.speedY = -SPEED * player.ownPaddle.speedModifier;
  } else if (player.input === PlayerInput.down) {
    player.ownPaddle.speedY = SPEED * player.ownPaddle.speedModifier;
  } else {
    player.ownPaddle.speedY = 0;
  }
}

export function handleInput(gameArea: GameArea): void {
  if (gameArea.runningState !== gameRunningState.playing) return;
  handlePlayerInput(gameArea.leftPlayer);
  handlePlayerInput(gameArea.rightPlayer);
}
