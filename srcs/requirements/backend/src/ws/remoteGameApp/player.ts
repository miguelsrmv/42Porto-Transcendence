import { Ball } from './ball.js';
import { Paddle } from './paddle.js';
import { Attack } from './attack.js';
import { PlayerInput, Side } from './types.js';
import { gameStats } from './gameStats.js';
import { GameArea } from './gameArea.js';

export class Player {
  id: string;
  ownPaddle: Paddle;
  enemyPaddle: Paddle;
  ball: Ball;
  alias: string;
  score: number;
  attack: Attack | null;
  side: Side;
  input: PlayerInput;
  powerBarFill: number;
  isEliminated: boolean = false;

  constructor(
    id: string,
    ownPaddle: Paddle,
    enemyPaddle: Paddle,
    ball: Ball,
    alias: string,
    attackName: string | null,
    enemyAttackName: string | null,
    side: Side,
    stats: gameStats,
    gameArea: GameArea,
  ) {
    this.id = id;
    this.ownPaddle = ownPaddle;
    this.enemyPaddle = enemyPaddle;
    this.ball = ball;
    this.alias = alias;
    this.score = 0;
    this.attack = attackName
      ? new Attack(attackName, enemyAttackName, ownPaddle, enemyPaddle, ball, side, stats, gameArea)
      : null;
    this.side = side;
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
