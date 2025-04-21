import { Ball } from './ball.js';
import { Paddle } from './paddle.js';

export class Attack {
  ownPaddle: Paddle;
  enemyPaddle: Paddle;
  ball: Ball;
  attackName: string | undefined;

  constructor(attackName: string | undefined, ownPaddle: Paddle, enemyPaddle: Paddle, ball: Ball) {
    this.ownPaddle = ownPaddle;
    this.enemyPaddle = enemyPaddle;
    this.ball = ball;
    this.attackName = attackName;
  }

  attack(): void {
    if (!this.attackName) return;

    console.log(`Player space used ${this.attackName}`);
    //  TODO: Implement attackIsEnabled state variable
    // const attackCooldown: { [key: string]: number } = {
    //   'Super Shroom': 2,
    //   'Egg Barrage': 3,
    //   'Spin Dash': 2,
    //   'Thunder Wave': 3,
    //   Confusion: 2,
    //   'Hurricane Blade': 5,
    //   Missiles: 4,
    //   'Giant Punch': 5,
    // };

    const attackMap: { [key: string]: () => void } = {
      'Super Shroom': () => this.superShroom(),
      'Egg Barrage': () => this.eggBarrage(),
      'Spin Dash': () => this.spinDash(),
      'Thunder Wave': () => this.thunderWave(),
      Confusion: () => this.confusion(),
      'Magic Mirror': () => this.magicMirror(),
      Mini: () => this.mini(),
      'Giant Punch': () => this.giantPunch(),
    };

    // TODO: Uncommend after attackIsEnabled is implemented
    //if (this.attackIsEnabled)
    attackMap[this.attackName]?.();
  }

  superShroom(): void {
    this.ownPaddle.increaseHeight(1.25);
  }

  eggBarrage(): void {}

  spinDash(): void {
    this.ball.increaseSpeed(5);
  }

  thunderWave(): void {}

  confusion(): void {}

  magicMirror(): void {}

  mini(): void {}

  giantPunch(): void {}
}
