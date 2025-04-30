import { Ball } from './ball.js';
import { Paddle } from './paddle.js';
import { Attack } from './attack.js';
import WebSocket from 'ws';
import { PlayerInput } from '../types.js';
import { gameStats } from './gameStats.js';

export class Player {
  ownPaddle: Paddle;
  enemyPaddle: Paddle;
  ball: Ball;
  alias?: string;
  score: number;
  attack: Attack | null;
  side: string;
  socket: WebSocket;
  input: PlayerInput;

  constructor(
    ownPaddle: Paddle,
    enemyPaddle: Paddle,
    ball: Ball,
    alias: string,
    attackName: string | null,
    side: string,
    socket: WebSocket,
    stats: gameStats,
  ) {
    this.ownPaddle = ownPaddle;
    this.enemyPaddle = enemyPaddle;
    this.ball = ball;
    this.alias = alias;
    this.score = 0;
    this.attack = attackName
      ? new Attack(attackName, ownPaddle, enemyPaddle, ball, side, stats)
      : null;
    this.side = side;
    this.socket = socket;
    this.input = PlayerInput.stop;
  }

  increaseScore(): void {
    ++this.score;
  }

  getScore(): number {
    return this.score;
  }
}
