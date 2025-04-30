import { gameArea, gameState, SPEED } from './game.js';
import { PlayerInput } from '../types.js';

// Add event listeners for keydown and keyup events
export function setupInput(gameArea: gameArea) {
  gameArea.leftPlayer.socket.on('message', (message) => {
    const parsedMessage = JSON.parse(message.toString());
    if (parsedMessage.type === 'movement') {
      gameArea.leftPlayer.input = parsedMessage.direction as PlayerInput;
    }
    if (parsedMessage.type === 'power_up') {
      gameArea.leftPlayer.attack?.attack();
    }
  });
  gameArea.rightPlayer.socket.on('message', (message) => {
    const parsedMessage = JSON.parse(message.toString());
    if (parsedMessage.type === 'movement') {
      gameArea.rightPlayer.input = parsedMessage.direction as PlayerInput;
    }
    if (parsedMessage.type === 'power_up') {
      gameArea.rightPlayer.attack?.attack();
    }
  });
}

// Update paddle movement based on key input
export function handleInput(gameArea: gameArea): void {
  if (gameArea.state !== gameState.playing) return;

  if (gameArea.leftPlayer.input === PlayerInput.up) {
    gameArea.leftPlayer.ownPaddle.speedY = -SPEED * gameArea.leftPlayer.ownPaddle.speedModifier;
  } else if (gameArea.leftPlayer.input === PlayerInput.down) {
    gameArea.leftPlayer.ownPaddle.speedY = SPEED * gameArea.leftPlayer.ownPaddle.speedModifier;
  } else {
    gameArea.leftPlayer.ownPaddle.speedY = 0;
  }

  if (gameArea.rightPlayer.input === PlayerInput.up) {
    gameArea.rightPlayer.ownPaddle.speedY = -SPEED * gameArea.rightPlayer.ownPaddle.speedModifier;
  } else if (gameArea.rightPlayer.input === PlayerInput.down) {
    gameArea.rightPlayer.ownPaddle.speedY = SPEED * gameArea.rightPlayer.ownPaddle.speedModifier;
  } else {
    gameArea.rightPlayer.ownPaddle.speedY = 0;
  }
}

export function handlePowerUp(gameArea: gameArea): void {
  if (gameArea.state !== gameState.playing) return;


}
