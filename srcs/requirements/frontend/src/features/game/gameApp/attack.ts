import { Ball } from './ball.js';
import { Paddle } from './paddle.js';
import { wait } from '../../../utils/helpers.js';
import { getGameVersion } from './game.js';
import type { attackIdentifier } from '../characterData/characterData.types.js';

type AttackData = {
  handler: () => Promise<void>; // The attack function
  duration: number; // How long the effect lasts
  cooldown: number; // How long until the attack can be used again, in miliseconds
};

export class Attack {
  ownPaddle: Paddle;
  enemyPaddle: Paddle;
  ball: Ball;
  attackName: string | undefined;
  side: string;
  lastUsed: number;
  attackIsAvailable: boolean;
  activeAttack: () => Promise<void>;
  attackDuration: number;
  attackCooldown: number;
  attackMap: { [key in attackIdentifier]: AttackData };

  constructor(
    attackName: string | undefined,
    ownPaddle: Paddle,
    enemyPaddle: Paddle,
    ball: Ball,
    side: string,
  ) {
    this.ownPaddle = ownPaddle;
    this.enemyPaddle = enemyPaddle;
    this.ball = ball;
    this.attackName = attackName;
    this.side = side;
    this.lastUsed = Date.now();
    this.attackIsAvailable = false;
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

    this.powerUpAnimation();

    this.activeAttack();

    this.attackIsAvailable = false;
  }

  reset(): void {
    this.lastUsed = Date.now();
    this.attackIsAvailable = false;
  }

  gameVersionHasChanged(oldVersion: number): boolean {
    return oldVersion !== getGameVersion() ? true : false;
  }

  async superShroom(): Promise<void> {
    const startingVersion = getGameVersion();

    const growthFactor = 1.25;

    const originalHeight = this.ownPaddle.height;
    const originalY = this.ownPaddle.y;

    const boostedHeight = originalHeight * growthFactor;
    const yOffset = (boostedHeight - originalHeight) / 2;

    this.ownPaddle.setHeight(boostedHeight);
    this.ownPaddle.setY(originalY - yOffset);

    if (!this.gameVersionHasChanged(startingVersion)) {
      const newOriginalY = this.ownPaddle.y;
      this.ownPaddle.setHeight(originalHeight);
      this.ownPaddle.setY(newOriginalY + yOffset);
    }
  }

  //TODO: Draw On Canvas
  async eggBarrage(): Promise<void> {
    await wait(this.attackDuration);
  }

  async spinDash(): Promise<void> {
    const startingVersion = getGameVersion();

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

    await wait(this.attackDuration);

    if (!this.gameVersionHasChanged(startingVersion)) {
      const oldSpeedX = this.ball.speedX > 0 ? Math.abs(startingSpeedX) : -Math.abs(startingSpeedX);
      const oldSpeedY = this.ball.speedY > 0 ? Math.abs(startingSpeedY) : -Math.abs(startingSpeedY);

      this.ball.setSpeed(oldSpeedX, oldSpeedY);
    }
  }

  async thunderWave(): Promise<void> {
    const startingVersion = getGameVersion();

    const slowdownFactor = 0.5;

    this.enemyPaddle.setSpeedModifier(slowdownFactor);

    await wait(this.attackDuration);

    if (!this.gameVersionHasChanged(startingVersion)) {
      this.enemyPaddle.setSpeedModifier(1);
    }
  }

  async confusion(): Promise<void> {
    const startingVersion = getGameVersion();

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
    const startingVersion = getGameVersion();

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
    const startingVersion = getGameVersion();

    const shrinkFactor = 0.5;

    const originalHeight = this.enemyPaddle.height;
    const originalY = this.enemyPaddle.y;

    const boostedHeight = originalHeight * shrinkFactor;
    const yOffset = (boostedHeight - originalHeight) / 2;

    this.enemyPaddle.setHeight(boostedHeight);
    this.enemyPaddle.setY(originalY - yOffset);

    await wait(this.attackDuration);

    if (!this.gameVersionHasChanged(startingVersion)) {
      const newOriginalY = this.enemyPaddle.y;
      this.enemyPaddle.setHeight(originalHeight);
      this.enemyPaddle.setY(newOriginalY + yOffset);
    }
  }

  powerUpAnimation() {
    const portrait = document.getElementById(`${this.side}-character-portrait`);
    const powerBar = document.getElementById(`${this.side}-character-power-bar-fill`);

    if (!portrait) return; // Exit if portrait not found

    // Extract the current border color to use in the animation
    const computedStyle = window.getComputedStyle(portrait);
    const borderColor = computedStyle.borderColor;

    // Set the color property to the border color for use with currentColor in CSS
    portrait.style.color = borderColor;

    // Add the power-up animation class
    portrait.classList.add('power-up');

    // Handle power bar animation if it exists
    if (powerBar) {
      // Get current power or use default
      const currentPower = parseFloat(powerBar.style.width) || 45;

      // Calculate new power (increase by 25%, cap at 100%)
      const newPower = Math.min(currentPower + 25, 100);

      // Apply animation class and set new width
      powerBar.classList.add('power-increase');
      powerBar.style.width = newPower + '%';
    }

    // Temporarily increase border width for emphasis
    portrait.style.borderWidth = '6px';

    // Remove power-up animation class after it completes
    setTimeout(() => {
      portrait.classList.remove('power-up');

      // Add final shimmer effect
      portrait.classList.add('final-shimmer');

      // Remove shimmer after it completes
      setTimeout(() => {
        portrait.classList.remove('final-shimmer');
        // Optional: Reset border width to original after animations complete
        // portrait.style.borderWidth = originalBorderWidth;
      }, 600);
    }, 800);

    // Add small jump when animation ends for that extra touch
    setTimeout(() => {
      portrait.animate(
        [
          { transform: 'translateY(0)' },
          { transform: 'translateY(-10px)' },
          { transform: 'translateY(0)' },
        ],
        {
          duration: 300,
          easing: 'ease-in-out',
        },
      );
    }, 900);
  }
}
