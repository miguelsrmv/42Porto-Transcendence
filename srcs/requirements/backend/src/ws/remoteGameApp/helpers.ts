import { gameType, playType } from './settings';
import { PlayerInput } from './types';

export function wait(seconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}

export function isPlayerInput(direction: string) {
  return Object.values(PlayerInput).includes(direction as PlayerInput);
}

export function isGameType(type: string) {
  const types: gameType[] = ['Classic Pong', 'Crazy Pong'];
  return types.includes(type as gameType);
}

export function isPlayType(type: string) {
  const types: playType[] = ['Local Play', 'Remote Play', 'Tournament Play'];
  return types.includes(type as playType);
}
