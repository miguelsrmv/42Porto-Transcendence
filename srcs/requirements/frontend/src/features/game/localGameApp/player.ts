import { Ball } from './ball.js';
import { Paddle } from './paddle.js';
import { Attack } from './attack.js';

export class Player {
  ownPaddle: Paddle;
  enemyPaddle: Paddle;
  ball: Ball;
  alias?: string;
  score: number;
  attack?: Attack;
  side: string;

  constructor(
    ownPaddle: Paddle,
    enemyPaddle: Paddle,
    ball: Ball,
    alias: string | undefined,
    attackName: string | undefined,
    side: string,
  ) {
    this.ownPaddle = ownPaddle;
    this.enemyPaddle = enemyPaddle;
    this.ball = ball;
    this.alias = alias;
    this.score = 0;
    this.attack = new Attack(attackName, ownPaddle, enemyPaddle, ball, side);
    this.side = side;
  }

  increaseScore(): void {
    ++this.score;
  }

  getScore(): number {
    return this.score;
  }
}
