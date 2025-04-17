import { SPEED } from './game.js';

// Interface for paddle to define expected structure
interface Paddle {
	speedY: number;
}

// Track key states
const keys: Record<string, boolean> = {};

// Add event listeners for keydown and keyup events
export function setupInput(): void {
	window.addEventListener('keydown', (e: KeyboardEvent) => {
		keys[e.key] = true;
	});

	window.addEventListener('keyup', (e: KeyboardEvent) => {
		keys[e.key] = false;
	});
}

// Update paddle movement based on key input
export function handleInput(leftPaddle: Paddle, rightPaddle: Paddle): void {
	// Left paddle ('w' and 's')
	if (keys['w']) {
		leftPaddle.speedY = -SPEED;
	} else if (keys['s']) {
		leftPaddle.speedY = SPEED;
	} else {
		leftPaddle.speedY = 0;
	}

	// Right paddle ('ArrowUp' and 'ArrowDown')
	if (keys['ArrowUp']) {
		rightPaddle.speedY = -SPEED;
	} else if (keys['ArrowDown']) {
		rightPaddle.speedY = SPEED;
	} else {
		rightPaddle.speedY = 0;
	}
}
