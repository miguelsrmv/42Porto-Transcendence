import { Ball } from './ball.js';
import { Paddle } from './paddle.js';
import { Attack } from './attack.js';

export class Player {
  ownPaddle: Paddle;
  enemyPaddle: Paddle;
  ball: Ball;
  alias?: string;
  score: number;
  attack: Attack | null;
  side: string;

  constructor(
    ownPaddle: Paddle,
    enemyPaddle: Paddle,
    ball: Ball,
    alias: string,
    attackName: string | null,
    side: string,
  ) {
    this.ownPaddle = ownPaddle;
    this.enemyPaddle = enemyPaddle;
    this.ball = ball;
    this.alias = alias;
    this.score = 0;
    this.attack = attackName ? new Attack(attackName, ownPaddle, enemyPaddle, ball, side) : null;
    this.side = side;
  }

  increaseScore(): void {
    ++this.score;
  }

  getScore(): number {
    return this.score;
  }
}
