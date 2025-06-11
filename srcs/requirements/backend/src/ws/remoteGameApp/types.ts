import { Ball } from './ball';
import { gameStats } from './gameStats';
import { Paddle } from './paddle';
import { gameSettings, leanGameSettings } from './settings';

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

export type PlayerTuple = [string, string, string];

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

export interface tournamentPlayer {
  id: string;
  userAlias: string;
  avatarPath: string;
  quarterFinalScore?: string;
  semiFinalScore?: string;
  finalScore?: string;
}

export type ClientMessage =
  | { type: 'join_game'; playerSettings: leanGameSettings }
  | { type: 'movement'; direction: PlayerInput }
  | { type: 'power_up' }
  | { type: 'ping' }
  | { type: 'stop_game' }
  | { type: 'ready_for_next_game' };

export type Side = 'left' | 'right';

export type ServerMessage =
  | { type: 'game_setup'; settings: gameSettings }
  | { type: 'game_start' }
  | { type: 'game_state'; state: GameState }
  | { type: 'game_goal'; scoringSide: Side }
  | {
      type: 'game_end';
      winningPlayer: Side;
      ownSide: Side;
      stats: gameStats;
    }
  | { type: 'player_left' }
  | { type: 'tournament_end' }
  | { type: 'tournament_status'; participants: tournamentPlayer[] }
  | { type: 'error'; message: string };
