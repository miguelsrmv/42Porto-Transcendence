import { Attack } from './attack.js';
export class Player {
    ownPaddle;
    enemyPaddle;
    ball;
    alias;
    score;
    attack;
    side;
    constructor(ownPaddle, enemyPaddle, ball, alias, attackName, side) {
        this.ownPaddle = ownPaddle;
        this.enemyPaddle = enemyPaddle;
        this.ball = ball;
        this.alias = alias;
        this.score = 0;
        this.attack = new Attack(attackName, ownPaddle, enemyPaddle, ball, side);
        this.side = side;
    }
    increaseScore() {
        ++this.score;
    }
    getScore() {
        return this.score;
    }
}
//# sourceMappingURL=player.js.map