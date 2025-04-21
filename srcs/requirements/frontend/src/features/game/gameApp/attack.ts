import { Ball } from './ball.js';
import { Paddle } from './paddle.js';
import { wait } from '../../../utils/helpers.js';

let gameStateHasChanged: boolean = false;

window.addEventListener('paused', () => {
  gameStateHasChanged = true;
});

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

    const attackMap: { [key: string]: () => Promise<void> } = {
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
    gameStateHasChanged = false;
  }

  async superShroom(): Promise<void> {
    const growthFactor = 1.25;

    const originalHeight = this.ownPaddle.height;
    const originalY = this.ownPaddle.y;

    const boostedHeight = originalHeight * growthFactor;
    const yOffset = (boostedHeight - originalHeight) / 2;

    this.ownPaddle.setHeight(boostedHeight);
    this.ownPaddle.setY(originalY - yOffset);

    await wait(2);

    if (!gameStateHasChanged) {
      const newOriginalY = this.ownPaddle.y;
      this.ownPaddle.setHeight(originalHeight);
      this.ownPaddle.setY(newOriginalY + yOffset);
    }
  }

  //TODO: Draw Canvas
  async eggBarrage(): Promise<void> {}

  async spinDash(): Promise<void> {
    const growthFactor = 5;

    const startingSpeedX = this.ball.speedX;
    const startingSpeedY = this.ball.speedY;

    const newSpeedX =
      Math.abs(this.ball.speedX) + growthFactor < 20
        ? this.ball.speedX + growthFactor * Math.sign(this.ball.speedX)
        : 20 * Math.sign(this.ball.speedX);
    const newSpeedY =
      Math.abs(this.ball.speedY) + growthFactor < 20
        ? this.ball.speedY + growthFactor * Math.sign(this.ball.speedY)
        : 20 * Math.sign(this.ball.speedY);

    this.ball.setSpeed(newSpeedX, newSpeedY);

    await wait(2);

    if (!gameStateHasChanged) {
      const oldSpeedX = this.ball.speedX > 0 ? Math.abs(startingSpeedX) : -Math.abs(startingSpeedX);
      const oldSpeedY = this.ball.speedY > 0 ? Math.abs(startingSpeedY) : -Math.abs(startingSpeedY);

      this.ball.setSpeed(oldSpeedX, oldSpeedY);
    }
  }

  async thunderWave(): Promise<void> {
    const slowdownFactor = 0.5;

    this.enemyPaddle.setSpeedModifier(slowdownFactor);

    await wait(2);

    if (!gameStateHasChanged) {
      this.enemyPaddle.setSpeedModifier(1);
    }
  }

  async confusion(): Promise<void> {
    const inversionFactor = -1;

    this.enemyPaddle.setSpeedModifier(inversionFactor);

    await wait(2);

    if (!gameStateHasChanged) {
      this.enemyPaddle.setSpeedModifier(1);
    }
  }

  async magicMirror(): Promise<void> {
    this.ball.setSpeed(this.ball.speedX, -this.ball.speedY);
  }

  async mini(): Promise<void> {
    const shrinkFactor = 0.5;

    const oldRadius = this.ball.radius;
    const newRadius = oldRadius * shrinkFactor;

    this.ball.setRadius(newRadius);

    await wait(2);

    if (!gameStateHasChanged) {
      this.ball.setRadius(oldRadius);
    }
  }

  async giantPunch(): Promise<void> {
    const shrinkFactor = 0.5;

    const originalHeight = this.enemyPaddle.height;
    const originalY = this.enemyPaddle.y;

    const boostedHeight = originalHeight * shrinkFactor;
    const yOffset = (boostedHeight - originalHeight) / 2;

    this.enemyPaddle.setHeight(boostedHeight);
    this.enemyPaddle.setY(originalY - yOffset);

    await wait(2);

    if (!gameStateHasChanged) {
      const newOriginalY = this.enemyPaddle.y;
      this.enemyPaddle.setHeight(originalHeight);
      this.enemyPaddle.setY(newOriginalY + yOffset);
    }
  }
}
