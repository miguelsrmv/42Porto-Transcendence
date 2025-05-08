import { Ball } from './ball.js';
import { CANVAS_HEIGHT, CANVAS_WIDTH, BALL_RADIUS, PADDLE_LEN, GameArea } from './gameArea.js';
import { MAX_BALL_SPEED } from './collisions.js';
import { wait } from './helpers.js';
import { gameStats } from './gameStats.js';
import { Paddle } from './paddle.js';
import { getGameVersion } from './game.js';

type AttackData = {
  handler: () => Promise<void>; // The attack function
  duration: number; // How long the effect lasts
  cooldown: number; // How long until the attack can be used again, in miliseconds
};

type attackIdentifier =
  | 'Super Shroom'
  | 'Egg Barrage'
  | 'Spin Dash'
  | 'Thunder Wave'
  | 'Confusion'
  | 'Magic Mirror'
  | 'Mini'
  | 'Giant Punch';

export class Attack {
  ownPaddle: Paddle;
  enemyPaddle: Paddle;
  ball: Ball;
  attackName: string | undefined;
  side: string;
  lastUsed: number;
  attackIsAvailable: boolean;
  stats: gameStats;
  activeAttack: () => Promise<void>;
  attackDuration: number;
  attackCooldown: number;
  attackMap: { [key in attackIdentifier]: AttackData };
  gameArea: GameArea;

  constructor(
    attackName: string | undefined,
    ownPaddle: Paddle,
    enemyPaddle: Paddle,
    ball: Ball,
    side: string,
    stats: gameStats,
    gameArea: GameArea,
  ) {
    this.ownPaddle = ownPaddle;
    this.enemyPaddle = enemyPaddle;
    this.ball = ball;
    this.attackName = attackName;
    this.side = side;
    this.lastUsed = Date.now();
    this.attackIsAvailable = false;
    this.stats = stats;
    this.gameArea = gameArea;
    this.attackMap = {
      'Super Shroom': {
        handler: async () => this.superShroom(),
        duration: 5,
        cooldown: 8000,
      },
      'Egg Barrage': {
        handler: async () => this.eggBarrage(),
        duration: 5,
        cooldown: 8000,
      },
      'Spin Dash': {
        handler: async () => this.spinDash(),
        duration: 2,
        cooldown: 10000,
      },
      'Thunder Wave': {
        handler: async () => this.thunderWave(),
        duration: 3,
        cooldown: 10000,
      },
      Confusion: {
        handler: async () => this.confusion(),
        duration: 4,
        cooldown: 7500,
      },
      'Magic Mirror': {
        handler: async () => this.magicMirror(),
        duration: 0,
        cooldown: 7500,
      },
      Mini: {
        handler: async () => this.mini(),
        duration: 5,
        cooldown: 5000,
      },
      'Giant Punch': {
        handler: async () => this.giantPunch(),
        duration: 4,
        cooldown: 10000,
      },
    };

    this.activeAttack = this.attackMap[attackName as attackIdentifier].handler;
    this.attackDuration = this.attackMap[attackName as attackIdentifier].duration;
    this.attackCooldown = this.attackMap[attackName as attackIdentifier].cooldown;
  }

  attack(): void {
    if (!this.attackName || !(this.attackName in this.attackMap) || !this.attackIsAvailable) return;

    this.lastUsed = Date.now();

    if (this.side === 'left') {
      this.stats.left.increasePowersUsed();
      this.gameArea.leftAnimation = true;
      this.gameArea.leftPlayer.powerBarFill = 0;
    } else {
      this.stats.right.increasePowersUsed();
      this.gameArea.rightAnimation = true;
      this.gameArea.rightPlayer.powerBarFill = 0;
    }

    this.activeAttack();

    this.attackIsAvailable = false;
  }

  reset(beforeTime: number, newTime: number): void {
    this.lastUsed += newTime - beforeTime;
    //this.attackIsAvailable = false;
  }

  gameVersionHasChanged(oldVersion: number): boolean {
    return oldVersion !== getGameVersion(this.gameArea) ? true : false;
  }

  async superShroom(): Promise<void> {
    console.log(`Super shroom called by ${this.side}`);
    const growth = PADDLE_LEN * 0.25;

    const startingVersion = getGameVersion(this.gameArea);

    const originalHeight = this.ownPaddle.height;
    const originalY = this.ownPaddle.y;

    const boostedHeight = originalHeight + growth;
    const yOffset = (boostedHeight - originalHeight) / 2;

    this.ownPaddle.setHeight(boostedHeight);
    this.ownPaddle.setY(originalY - yOffset);

    await wait(this.attackDuration);

    if (!this.gameVersionHasChanged(startingVersion)) {
      const newOriginalY = this.ownPaddle.y;
      this.ownPaddle.setHeight(this.ownPaddle.height - growth);
      this.ownPaddle.setY(newOriginalY + yOffset);
    }
  }

  async eggBarrage(): Promise<void> {
    const fakeEggNumber = 5;

    const startingVersion = getGameVersion(this.gameArea);

    for (let i = 0; i < fakeEggNumber; i++) {
      const fakeBall = new Ball(
        Math.random() * 0.5 * CANVAS_WIDTH + 0.25 * CANVAS_WIDTH,
        Math.random() * 0.5 * CANVAS_HEIGHT + 0.25 * CANVAS_HEIGHT,
        BALL_RADIUS,
        this.ball.speedX * (Math.random() > 0.5 ? 1 : -1),
        this.ball.speedY * (Math.random() > 0.5 ? 1 : -1),
      );
      this.gameArea.fakeBalls.push(fakeBall);
    }

    await wait(this.attackDuration);

    if (!this.gameVersionHasChanged(startingVersion)) {
      for (let i = 0; i < fakeEggNumber; i++) this.gameArea.fakeBalls.shift();
    }
  }

  async spinDash(): Promise<void> {
    const startingVersion = getGameVersion(this.gameArea); // Check score changes

    const growthFactor = 1.25; // Speed multiplier

    const startingSpeedX = this.ball.speedX;
    const startingSpeedY = this.ball.speedY;

    const currentSpeedXMag = Math.abs(startingSpeedX);
    const boostedSpeedXMag = currentSpeedXMag * growthFactor;
    const cappedSpeedXMag = Math.min(boostedSpeedXMag, MAX_BALL_SPEED);
    const newSpeedX = cappedSpeedXMag * Math.sign(startingSpeedX);

    const currentSpeedYMag = Math.abs(startingSpeedY);
    const boostedSpeedYMag = currentSpeedYMag * growthFactor;
    const cappedSpeedYMag = Math.min(boostedSpeedYMag, MAX_BALL_SPEED);
    const newSpeedY = cappedSpeedYMag * Math.sign(startingSpeedY);

    this.ball.setSpeed(newSpeedX, newSpeedY);

    await wait(this.attackDuration);

    if (!this.gameVersionHasChanged(startingVersion)) {
      const currentSpeedX = this.ball.speedX;
      const currentSpeedY = this.ball.speedY;

      const originalMagnitude = Math.sqrt(startingSpeedX ** 2 + startingSpeedY ** 2);
      const currentMagnitude = Math.sqrt(currentSpeedX ** 2 + currentSpeedY ** 2);

      const scaleFactor = originalMagnitude / currentMagnitude;
      const revertedSpeedX = currentSpeedX * scaleFactor;
      const revertedSpeedY = currentSpeedY * scaleFactor;

      this.ball.setSpeed(revertedSpeedX, revertedSpeedY);
    }
  }

  async thunderWave(): Promise<void> {
    const startingVersion = getGameVersion(this.gameArea);

    const slowdownFactor = 0.5;

    this.enemyPaddle.setSpeedModifier(slowdownFactor);

    await wait(this.attackDuration);

    if (!this.gameVersionHasChanged(startingVersion)) {
      this.enemyPaddle.setSpeedModifier(1);
    }
  }

  async confusion(): Promise<void> {
    const startingVersion = getGameVersion(this.gameArea);

    const inversionFactor = -1;

    this.enemyPaddle.setSpeedModifier(inversionFactor);

    await wait(this.attackDuration);

    if (!this.gameVersionHasChanged(startingVersion)) {
      this.enemyPaddle.setSpeedModifier(1);
    }
  }

  async magicMirror(): Promise<void> {
    this.ball.setSpeed(this.ball.speedX, -this.ball.speedY);
  }

  async mini(): Promise<void> {
    const startingVersion = getGameVersion(this.gameArea);

    const shrinkFactor = 0.5;

    const oldRadius = this.ball.radius;
    const newRadius = oldRadius * shrinkFactor;

    this.ball.setRadius(newRadius);

    await wait(this.attackDuration);

    if (!this.gameVersionHasChanged(startingVersion)) {
      this.ball.setRadius(oldRadius);
    }
  }

  async giantPunch(): Promise<void> {
    console.log('Giant punch called');
    const startingVersion = getGameVersion(this.gameArea);

    const shrink = PADDLE_LEN * 0.4;

    const originalHeight = this.enemyPaddle.height;
    const originalY = this.enemyPaddle.y;

    const boostedHeight = originalHeight - shrink;
    const yOffset = (boostedHeight - originalHeight) / 2;

    this.enemyPaddle.setHeight(boostedHeight);
    this.enemyPaddle.setY(originalY - yOffset);

    await wait(this.attackDuration);

    if (!this.gameVersionHasChanged(startingVersion)) {
      const newOriginalY = this.enemyPaddle.y;
      this.enemyPaddle.setHeight(this.enemyPaddle.height + shrink);
      this.enemyPaddle.setY(newOriginalY + yOffset);
    }
  }
}
