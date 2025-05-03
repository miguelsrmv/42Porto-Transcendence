import { Ball } from './ball';
import { gameStats } from './gameStats';
import { Paddle } from './paddle';
import { gameSettings, leanGameSettings } from './settings';
import WebSocket from 'ws';

export interface GameState {
  ball: Ball;
  fakeBalls: Ball[];
  leftPaddle: Paddle;
  rightPaddle: Paddle;
  leftPowerBarFill: number;
  rightPowerBarFill: number;
  leftAnimation: boolean;
  rightAnimation: boolean;
}

export enum gameRunningState {
  playing,
  paused,
  ended,
}

export enum PlayerInput {
  up = 'up',
  down = 'down',
  stop = 'stop',
}

export type ClientMessage =
  | { type: 'join_game'; playerSettings: leanGameSettings }
  | { type: 'movement'; direction: PlayerInput }
  | { type: 'power_up' }
  | { type: 'stop_game' };

export type ServerMessage =
  | { type: 'game_setup'; settings: gameSettings }
  | { type: 'game_start' }
  | { type: 'game_state'; state: GameState }
  | { type: 'game_goal'; scoringSide: 'left' | 'right' }
  | { type: 'game_end'; winningPlayer: 'left' | 'right'; stats: gameStats }
  | { type: 'player_left' }
  | { type: 'error'; message: string };

export interface GameSession {
  players: Map<WebSocket, string>;
  settings: gameSettings;
}

// To be able to print
export interface GameSessionSerializable {
  players: string[]; // just the player IDs
  settings: gameSettings;
}
