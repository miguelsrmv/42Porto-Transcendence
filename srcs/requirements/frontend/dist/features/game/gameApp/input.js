import { SPEED } from './game.js';
// Track key states
const keys = {};
// Add event listeners for keydown and keyup events
export function setupInput() {
    window.addEventListener('keydown', (e) => {
        keys[e.key] = true;
    });
    window.addEventListener('keyup', (e) => {
        keys[e.key] = false;
    });
}
// Update paddle movement based on key input
export function handleInput(leftPaddle, rightPaddle) {
    // Left paddle ('w' and 's')
    if (keys['w']) {
        leftPaddle.speedY = -SPEED;
    }
    else if (keys['s']) {
        leftPaddle.speedY = SPEED;
    }
    else {
        leftPaddle.speedY = 0;
    }
    // Right paddle ('ArrowUp' and 'ArrowDown')
    if (keys['ArrowUp']) {
        rightPaddle.speedY = -SPEED;
    }
    else if (keys['ArrowDown']) {
        rightPaddle.speedY = SPEED;
    }
    else {
        rightPaddle.speedY = 0;
    }
}
//# sourceMappingURL=input.js.map