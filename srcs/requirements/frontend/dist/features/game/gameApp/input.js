import { gameState, SPEED } from './game.js';
// Track key states
const keys = {};
function resetKeys() {
    for (const key in keys) {
        keys[key] = false;
    }
}
// Add event listeners for keydown and keyup events
export function setupInput(leftPlayer, rightPlayer) {
    const keyDownHandler = (e) => {
        if (e.key === ' ') {
            leftPlayer.attack?.attack();
        }
        else if (e.key === 'Enter') {
            rightPlayer.attack?.attack();
        }
        else {
            keys[e.key] = true;
        }
    };
    const keyUpHandler = (e) => {
        keys[e.key] = false;
    };
    window.addEventListener('keydown', keyDownHandler);
    window.addEventListener('keyup', keyUpHandler);
    return {
        disable: () => {
            window.removeEventListener('keydown', keyDownHandler);
            window.removeEventListener('keyup', keyUpHandler);
        },
        enable: () => {
            window.addEventListener('keydown', keyDownHandler);
            window.addEventListener('keyup', keyUpHandler);
        },
    };
}
// Update paddle movement based on key input
export function handleInput(leftPlayer, rightPlayer, state) {
    if (state == gameState.paused) {
        resetKeys();
        return;
    }
    // Left paddle ('w' and 's')
    if (keys['w']) {
        leftPlayer.ownPaddle.speedY = -SPEED * leftPlayer.ownPaddle.speedModifier;
    }
    else if (keys['s']) {
        leftPlayer.ownPaddle.speedY = SPEED * leftPlayer.ownPaddle.speedModifier;
    }
    else {
        leftPlayer.ownPaddle.speedY = 0;
    }
    // Right paddle ('ArrowUp' and 'ArrowDown')
    if (keys['ArrowUp']) {
        rightPlayer.ownPaddle.speedY = -SPEED * rightPlayer.ownPaddle.speedModifier;
    }
    else if (keys['ArrowDown']) {
        rightPlayer.ownPaddle.speedY = SPEED * rightPlayer.ownPaddle.speedModifier;
    }
    else {
        rightPlayer.ownPaddle.speedY = 0;
    }
}
//# sourceMappingURL=input.js.map