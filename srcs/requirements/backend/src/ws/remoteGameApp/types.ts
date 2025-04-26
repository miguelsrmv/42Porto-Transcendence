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
}

export type ClientMessage =
  | { type: 'join_game'; playerSettings: leanGameSettings }
  | { type: 'movement'; direction: 'up' | 'down' | 'stop' }
  | { type: 'power_up' };

export type ServerMessage =
  | { type: 'game_state'; state: GameSate }
  | { type: 'game_start'; players: [string, string] }
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
