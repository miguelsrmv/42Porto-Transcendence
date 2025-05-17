import { GameArea, SPEED } from './gameArea.js';
import { Player } from './player.js';
import { gameRunningState, PlayerInput } from './types.js';

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
