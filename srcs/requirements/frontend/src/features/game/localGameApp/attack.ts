import { Ball } from './ball.js';
import { Paddle } from './paddle.js';
import { wait } from '../../../utils/helpers.js';
import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  BALL_RADIUS,
  PADDLE_LEN,
  SPEED,
  getGameVersion,
  fakeBalls,
} from './game.js';
import type { attackIdentifier } from '../characterData/characterData.types.js';
import { powerUpAnimation } from '../animations/animations.js';
import { MAX_BALL_SPEED } from './collisions.js';
import { stats } from './game.js';

/**
 * @file attack.ts
 * @brief Defines the Attack class for handling various attack actions in the game.
 *
 * This file contains the Attack class, which manages different attack actions that can be
 * performed by players during the game. Each attack has a specific handler, duration, and cooldown.
 */

/**
 * @brief Type definition for attack data.
 *
 * This type defines the structure for attack data, including the handler function,
 * duration of the attack, and cooldown period.
 */
type AttackData = {
  handler: () => Promise<void>; // The attack function
  duration: number; // How long the effect lasts
  cooldown: number; // How long until the attack can be used again, in miliseconds
};

/**
 * @brief Class representing an attack in the game.
 *
 * The Attack class manages the execution and timing of various attacks that can be
 * performed by players. It handles the availability, activation, and effects of each attack.
 */
export class Attack {
  ownPaddle: Paddle;
  enemyPaddle: Paddle;
  ball: Ball;
  attackName: string | undefined;
  enemyAttackName: string | null;
  side: string;
  lastUsed: number;
  attackIsAvailable: boolean;
  activeAttack: () => Promise<void>;
  attackDuration: number;
  attackCooldown: number;
  attackMap: { [key in attackIdentifier]: AttackData };

  /**
   * @brief Constructs an Attack object.
   *
   * Initializes the attack with the specified parameters and sets up the attack map.
   *
   * @param attackName The name of the attack.
   * @param ownPaddle The player's paddle.
   * @param enemyPaddle The opponent's paddle.
   * @param ball The game ball.
   * @param side The side of the player ('left' or 'right').
   */
  constructor(
    attackName: string | undefined,
    enemyAttackName: string | null,
    ownPaddle: Paddle,
    enemyPaddle: Paddle,
    ball: Ball,
    side: string,
  ) {
    this.ownPaddle = ownPaddle;
    this.enemyPaddle = enemyPaddle;
    this.ball = ball;
    this.attackName = attackName;
    this.enemyAttackName = enemyAttackName;
    this.side = side;
    this.lastUsed = Date.now();
    this.attackIsAvailable = false;
    this.attackMap = {
      'Super Shroom': {
        handler: async () => this.superShroom(),
        duration: 5,
        cooldown: 6000,
      },
      'Egg Barrage': {
        handler: async () => this.eggBarrage(),
        duration: 5,
        cooldown: 6000,
      },
      'Spin Dash': {
        handler: async () => this.spinDash(),
        duration: 3,
        cooldown: 8000,
      },
      'Thunder Wave': {
        handler: async () => this.thunderWave(),
        duration: 3,
        cooldown: 10000,
      },
      Confusion: {
        handler: async () => this.confusion(),
        duration: 4,
        cooldown: 10000,
      },
      'Magic Mirror': {
        handler: async () => this.magicMirror(),
        duration: 0,
        cooldown: 14000,
      },
      'The Amazing Mirror': {
        handler: async () => this.theAmazingMirror(),
        duration: 4,
        cooldown: 10000,
      },
      'Giant Punch': {
        handler: async () => this.giantPunch(),
        duration: 4,
        cooldown: 8000,
      },
    };

    if (attackName !== 'The Amazing Mirror')
      this.activeAttack = this.attackMap[attackName as attackIdentifier].handler;
    else this.activeAttack = this.attackMap[enemyAttackName as attackIdentifier].handler;
    this.attackDuration = this.attackMap[attackName as attackIdentifier].duration;
    this.attackCooldown = this.attackMap[attackName as attackIdentifier].cooldown;
  }

  /**
   * @brief Executes the attack if it is available.
   *
   * This method checks if the attack is available and executes it, updating the last used
   * timestamp and triggering the power-up animation.
   */
  attack(): void {
    if (!this.attackName || !(this.attackName in this.attackMap) || !this.attackIsAvailable) return;

    this.lastUsed = Date.now();

    this.side === 'left' ? stats.left.increasePowersUsed() : stats.right.increasePowersUsed();

    powerUpAnimation(this.side);

    this.activeAttack();

    this.attackIsAvailable = false;
  }

  /**
   * @brief Resets the attack timing based on the game time.
   *
   * This method adjusts the last used timestamp of the attack based on the difference
   * between the new and previous game times.
   *
   * @param beforeTime The previous game time.
   * @param newTime The new game time.
   */
  reset(beforeTime: number, newTime: number): void {
    this.lastUsed += newTime - beforeTime;
    //this.attackIsAvailable = false;
  }

  /**
   * @brief Checks if the game version has changed.
   *
   * This method compares the current game version with the provided old version to
   * determine if a change has occurred.
   *
   * @param oldVersion The previous game version.
   * @return True if the game version has changed, false otherwise.
   */
  gameVersionHasChanged(oldVersion: number): boolean {
    return oldVersion !== getGameVersion() ? true : false;
  }

  /**
   * @brief Executes the Super Shroom attack.
   *
   * This attack temporarily increases the player's paddle size for the duration of the effect.
   */
  async superShroom(): Promise<void> {
    console.log(`Super shroom called by ${this.side}`);
    const growth = PADDLE_LEN * 0.25;

    const startingVersion = getGameVersion();

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

  /**
   * @brief Executes the Egg Barrage attack.
   *
   * This attack creates multiple fake balls on the game field for the duration of the effect.
   */
  async eggBarrage(): Promise<void> {
    let fakeEggNumber = 5;

    const startingVersion = getGameVersion();

    for (let i = 0; i < fakeEggNumber; i++) {
      let fakeBall = new Ball(
        Math.random() * 0.5 * CANVAS_WIDTH + 0.25 * CANVAS_WIDTH,
        Math.random() * 0.5 * CANVAS_HEIGHT + 0.25 * CANVAS_HEIGHT,
        BALL_RADIUS,
        this.ball.speedX * (Math.random() > 0.5 ? 1 : -1),
        this.ball.speedY * (Math.random() > 0.5 ? 1 : -1),
      );
      fakeBalls.push(fakeBall);
    }

    await wait(this.attackDuration);

    if (!this.gameVersionHasChanged(startingVersion)) {
      for (let i = 0; i < fakeEggNumber; i++) fakeBalls.shift();
    }
  }

  /**
   * @brief Executes the Spin Dash attack.
   *
   * This attack temporarily increases the ball's speed for the duration of the effect.
   */
  async spinDash(): Promise<void> {
    const startingVersion = getGameVersion(); // Check score changes

    const growthFactor = 1.25; // Speed multiplier

    const startingSpeedX = this.ball.speedX;
    const startingSpeedY = this.ball.speedY;

    const currentSpeedXMag = Math.abs(startingSpeedX);
    const boostedSpeedXMag = currentSpeedXMag * growthFactor;
    const newSpeedX = boostedSpeedXMag * Math.sign(startingSpeedX);

    const currentSpeedYMag = Math.abs(startingSpeedY);
    const boostedSpeedYMag = currentSpeedYMag * growthFactor;
    const newSpeedY = boostedSpeedYMag * Math.sign(startingSpeedY);

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

  /**
   * @brief Executes the Thunder Wave attack.
   *
   * This attack temporarily reduces the opponent's paddle speed for the duration of the effect.
   */
  async thunderWave(): Promise<void> {
    const startingVersion = getGameVersion();

    const slowdownFactor = 0.5;

    this.enemyPaddle.setSpeedModifier(slowdownFactor);

    await wait(this.attackDuration);

    if (!this.gameVersionHasChanged(startingVersion)) {
      this.enemyPaddle.setSpeedModifier(1);
    }
  }

  /**
   * @brief Executes the Confusion attack.
   *
   * This attack temporarily inverts the opponent's paddle controls for the duration of the effect.
   */
  async confusion(): Promise<void> {
    const startingVersion = getGameVersion();

    const inversionFactor = -1;

    this.enemyPaddle.setSpeedModifier(inversionFactor);

    await wait(this.attackDuration);

    if (!this.gameVersionHasChanged(startingVersion)) {
      this.enemyPaddle.setSpeedModifier(1);
    }
  }

  /**
   * @brief Executes the Magic Mirror attack.
   *
   * This attack instantly reverses the ball's vertical direction.
   */
  async magicMirror(): Promise<void> {
    this.ball.setSpeed(this.ball.speedX, -this.ball.speedY);
  }

  /**
   * @brief Uses the enemy's attack.
   *
   * This attack does nothing for cases of mirror Kirby matches
   */
  async theAmazingMirror(): Promise<void> {}

  /**
   * @brief Executes the Giant Punch attack.
   *
   * This attack temporarily reduces the opponent's paddle size for the duration of the effect.
   */
  async giantPunch(): Promise<void> {
    console.log('Giant punch called');
    const startingVersion = getGameVersion();

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
