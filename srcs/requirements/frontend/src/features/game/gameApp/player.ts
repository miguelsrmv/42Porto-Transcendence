import { Ball } from './ball';
import { Paddle } from './paddle';

export class Player {
  ownPaddle: Paddle;
  enemyPaddle: Paddle;
  ball: Ball;
  alias?: string;
  score: number;
  attackName?: string;

  constructor(
    ownPaddle: Paddle,
    enemyPaddle: Paddle,
    ball: Ball,
    alias: string | undefined,
    attackName: string | undefined,
  ) {
    this.ownPaddle = ownPaddle;
    this.enemyPaddle = enemyPaddle;
    this.ball = ball;
    this.alias = alias;
    this.score = 0;
    this.attackName = attackName;
  }

  attack(): void {
    if (!this.attackName) return;

    const attackMap: { [key: string]: void } = {
      'Super Shroom': this.superShroom(),
      'Egg Barrage': this.eggBarrage(),
      'Spin Dash': this.spinDash(),
      'Thunder Wave': this.thunderWave(),
      Confusion: this.confusion(),
      'Hurricane Blade': this.hurricaneBlade(),
      Missiles: this.missiles(),
      'Giant Punch': this.giantPunch(),
    };

    attackMap[this.attackName];
  }

  superShroom(): void {
    console.log(`${this.attackName} by ${this.alias}`);
  }

  eggBarrage(): void {
    console.log(`${this.attackName} by ${this.alias}`);
  }

  spinDash(): void {
    console.log(`${this.attackName} by ${this.alias}`);
  }

  thunderWave(): void {
    console.log(`${this.attackName} by ${this.alias}`);
  }

  confusion(): void {
    console.log(`${this.attackName} by ${this.alias}`);
  }

  hurricaneBlade(): void {
    console.log(`${this.attackName} by ${this.alias}`);
  }

  missiles(): void {
    console.log(`${this.attackName} by ${this.alias}`);
  }

  giantPunch(): void {
    console.log(`${this.attackName} by ${this.alias}`);
  }
}
