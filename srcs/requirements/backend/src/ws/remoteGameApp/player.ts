import { Ball } from './ball.js';
import { Paddle } from './paddle.js';
import { Attack } from './attack.js';
import WebSocket from 'ws';
import { PlayerInput } from './types.js';
import { gameStats } from './gameStats.js';
import { gameArea } from './game.js';

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
  powerBarFill: number;

  constructor(
    ownPaddle: Paddle,
    enemyPaddle: Paddle,
    ball: Ball,
    alias: string,
    attackName: string | null,
    side: string,
    socket: WebSocket,
    stats: gameStats,
    gameArea: gameArea,
  ) {
    this.ownPaddle = ownPaddle;
    this.enemyPaddle = enemyPaddle;
    this.ball = ball;
    this.alias = alias;
    this.score = 0;
    this.attack = attackName
      ? new Attack(attackName, ownPaddle, enemyPaddle, ball, side, stats, gameArea)
      : null;
    this.side = side;
    this.socket = socket;
    this.input = PlayerInput.stop;
    this.powerBarFill = 0;
  }

  increaseScore(): void {
    ++this.score;
  }

  getScore(): number {
    return this.score;
  }
}
