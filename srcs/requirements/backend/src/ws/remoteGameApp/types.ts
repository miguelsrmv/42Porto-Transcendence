import { Ball } from './localGameApp/ball';
import { gameStats } from './localGameApp/gameStats';
import { Paddle } from './localGameApp/paddle';
import { gameSettings, leanGameSettings } from './settings';
import WebSocket from 'ws';

export interface GameState {
  ball: Ball;
  leftPaddle: Paddle;
  rightPaddle: Paddle;
  leftPowerBarFill: number;
  rightPowerBarFill: number;
  leftAnimation: boolean;
  rightAnimation: boolean;
}

export enum PlayerInput {
  'up',
  'down',
  'stop',
}

export type ClientMessage =
  | { type: 'join_game'; playerSettings: leanGameSettings }
  | { type: 'movement'; direction: PlayerInput }
  | { type: 'power_up' };

export type ServerMessage =
  | { type: 'game_setup'; players: [string, string]; settings: gameSettings }
  | { type: 'game_start' }
  | { type: 'game_state'; state: GameState }
  | { type: 'game_goal'; scoringSide: 'left' | 'right' }
  | { type: 'game_end'; results: gameStats }
  | { type: 'error'; message: string };

export interface GameSession {
  players: Map<WebSocket, string>;
  settings: gameSettings;
  // state: GameSate;
}

// To be able to print
export interface GameSessionSerializable {
  players: string[]; // just the player IDs
  settings: gameSettings;
}
