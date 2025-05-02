import { GameArea, SPEED } from './gameArea.js';
import { gameRunningState, PlayerInput } from './types.js';

// Add event listeners for keydown and keyup events
export function setupInput(GameArea: GameArea) {
  GameArea.leftPlayer.socket.on('message', (message) => {
    const parsedMessage = JSON.parse(message.toString());
    if (parsedMessage.type === 'movement') {
      GameArea.leftPlayer.input = parsedMessage.direction as PlayerInput;
    } else if (parsedMessage.type === 'power_up') {
      GameArea.leftPlayer.attack?.attack();
    }
  });
  GameArea.rightPlayer.socket.on('message', (message) => {
    const parsedMessage = JSON.parse(message.toString());
    if (parsedMessage.type === 'movement') {
      GameArea.rightPlayer.input = parsedMessage.direction as PlayerInput;
    } else if (parsedMessage.type === 'power_up') {
      GameArea.rightPlayer.attack?.attack();
    }
  });
}

// Update paddle movement based on key input
export function handleInput(GameArea: GameArea): void {
  if (GameArea.runningState !== gameRunningState.playing) return;

  if (GameArea.leftPlayer.input === PlayerInput.up) {
    GameArea.leftPlayer.ownPaddle.speedY = -SPEED * GameArea.leftPlayer.ownPaddle.speedModifier;
  } else if (GameArea.leftPlayer.input === PlayerInput.down) {
    GameArea.leftPlayer.ownPaddle.speedY = SPEED * GameArea.leftPlayer.ownPaddle.speedModifier;
  } else {
    GameArea.leftPlayer.ownPaddle.speedY = 0;
  }

  if (GameArea.rightPlayer.input === PlayerInput.up) {
    GameArea.rightPlayer.ownPaddle.speedY = -SPEED * GameArea.rightPlayer.ownPaddle.speedModifier;
  } else if (GameArea.rightPlayer.input === PlayerInput.down) {
    GameArea.rightPlayer.ownPaddle.speedY = SPEED * GameArea.rightPlayer.ownPaddle.speedModifier;
  } else {
    GameArea.rightPlayer.ownPaddle.speedY = 0;
  }
}
