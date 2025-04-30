import { gameStats } from './localGameApp/gameStats';
import { gameSettings, leanGameSettings } from './settings';
import WebSocket from 'ws';

export interface GameSate {
  ball: { x: number; y: number; radius: number; speedY: number; speedX: number };
  leftPaddle: {
    x: number;
    y: number;
    height: number;
    width: number;
    color: string;
    speedY: number;
    speedModifier: number;
  };
  rightPaddle: {
    x: number;
    y: number;
    height: number;
    width: number;
    color: string;
    speedY: number;
    speedModifier: number;
  };
  leftPowerBar: number;
  rightPowerBar: number;
  leftAnimation: boolean;
  rightAnimation: boolean;
}

export enum PlayerInput {
  'up',
  'down',
  'stop',
}

enum AnimationType {
  'paint_score',
  'score',
}

enum SoundType {
  'score',
}

export type ClientMessage =
  | { type: 'join_game'; playerSettings: leanGameSettings }
  | { type: 'movement'; direction: PlayerInput }
  | { type: 'power_up' };

export type ServerMessage =
  | { type: 'game_setup'; players: [string, string]; settings: gameSettings }
  | { type: 'game_start' }
  | { type: 'game_state'; state: GameSate }
  | { type: 'game_end'; results: gameStats }
  | { type: 'animation'; animation: AnimationType; player: 'left' | 'right' }
  | { type: 'sound'; sound: SoundType }
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
