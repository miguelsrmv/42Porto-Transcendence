import { SPEED } from './game.js';

export class gameStats {
  left: playerStats;
  right: playerStats;
  maxSpeed: number;

  constructor() {
    this.left = new playerStats();
    this.right = new playerStats();
    this.maxSpeed = Math.sqrt(SPEED ** 2 + SPEED ** 2); // Done
  }

  updateMaxSpeed(newSpeed: number) {
    this.maxSpeed = newSpeed;
  }
}

class playerStats {
  goals: number;
  sufferedGoals: number;
  saves: number;
  powersUsed: number;

  constructor() {
    this.goals = 0;
    this.sufferedGoals = 0;
    this.saves = 0;
    this.powersUsed = 0;
  }

  increaseGoals() {
    ++this.goals;
  }

  increaseSufferedGoals() {
    ++this.sufferedGoals;
  }

  increaseSaves() {
    ++this.saves;
  }

  increasePowersUsed() {
    ++this.powersUsed;
  }
}
