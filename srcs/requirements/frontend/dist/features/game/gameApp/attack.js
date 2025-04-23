import { Ball } from './ball.js';
import { wait } from '../../../utils/helpers.js';
import { CANVAS_HEIGHT, CANVAS_WIDTH, BALL_RADIUS, getGameVersion, fakeBalls, } from './game.js';
import { powerUpAnimation } from './animations.js';
export class Attack {
    ownPaddle;
    enemyPaddle;
    ball;
    attackName;
    side;
    lastUsed;
    attackIsAvailable;
    activeAttack;
    attackDuration;
    attackCooldown;
    attackMap;
    constructor(attackName, ownPaddle, enemyPaddle, ball, side) {
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
        this.activeAttack = this.attackMap[attackName].handler;
        this.attackDuration = this.attackMap[attackName].duration;
        this.attackCooldown = this.attackMap[attackName].cooldown;
    }
    attack() {
        if (!this.attackName || !(this.attackName in this.attackMap) || !this.attackIsAvailable)
            return;
        this.lastUsed = Date.now();
        powerUpAnimation(this.side);
        this.activeAttack();
        this.attackIsAvailable = false;
    }
    reset(beforeTime, newTime) {
        this.lastUsed += newTime - beforeTime;
        //this.attackIsAvailable = false;
    }
    gameVersionHasChanged(oldVersion) {
        return oldVersion !== getGameVersion() ? true : false;
    }
    async superShroom() {
        const growthFactor = 1.25;
        const startingVersion = getGameVersion();
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
    async eggBarrage() {
        let fakeEggNumber = 5;
        const startingVersion = getGameVersion();
        for (let i = 0; i < fakeEggNumber; i++) {
            let fakeBall = new Ball(Math.random() * 0.5 * CANVAS_WIDTH + 0.25 * CANVAS_WIDTH, Math.random() * 0.5 * CANVAS_HEIGHT + 0.25 * CANVAS_HEIGHT, BALL_RADIUS, this.ball.speedX * (Math.random() > 0.5 ? 1 : -1), this.ball.speedY * (Math.random() > 0.5 ? 1 : -1));
            fakeBalls.push(fakeBall);
        }
        await wait(this.attackDuration);
        if (!this.gameVersionHasChanged(startingVersion)) {
            for (let i = 0; i < fakeEggNumber; i++)
                fakeBalls.shift();
        }
    }
    async spinDash() {
        const startingVersion = getGameVersion();
        const growthFactor = 5;
        const startingSpeedX = this.ball.speedX;
        const startingSpeedY = this.ball.speedY;
        const newSpeedX = Math.abs(this.ball.speedX) + growthFactor < 20
            ? this.ball.speedX + growthFactor * Math.sign(this.ball.speedX)
            : 20 * Math.sign(this.ball.speedX);
        const newSpeedY = Math.abs(this.ball.speedY) + growthFactor < 20
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
    async thunderWave() {
        const startingVersion = getGameVersion();
        const slowdownFactor = 0.5;
        this.enemyPaddle.setSpeedModifier(slowdownFactor);
        await wait(this.attackDuration);
        if (!this.gameVersionHasChanged(startingVersion)) {
            this.enemyPaddle.setSpeedModifier(1);
        }
    }
    async confusion() {
        const startingVersion = getGameVersion();
        const inversionFactor = -1;
        this.enemyPaddle.setSpeedModifier(inversionFactor);
        await wait(this.attackDuration);
        if (!this.gameVersionHasChanged(startingVersion)) {
            this.enemyPaddle.setSpeedModifier(1);
        }
    }
    async magicMirror() {
        this.ball.setSpeed(this.ball.speedX, -this.ball.speedY);
    }
    async mini() {
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
    async giantPunch() {
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
}
//# sourceMappingURL=attack.js.map