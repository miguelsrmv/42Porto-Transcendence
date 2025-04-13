/**
 * @file gameSetup.ts
 * @brief Handles the setup of game types, character selection, and background selection for the game.
 */

/**
 * @brief Prompts the user to select a game type.
 * 
 * This function waits for the user to click on either the "classic" or "crazy" game type button
 * and resolves the promise with the selected game type.
 * 
 * @return A promise that resolves to a string indicating the selected game type ("classic" or "crazy").
 */
export async function getGameType(): Promise<string> {
	return new Promise((resolve) => {
		const classicButton = document.getElementById("classic-pong-button");
		const crazyButton = document.getElementById("crazy-pong-button");

		if (classicButton && crazyButton) {
			classicButton.addEventListener("click", () => {
				resolve("classic");
			}, { once: true });
			crazyButton.addEventListener("click", () => {
				resolve("crazy");
			}, { once: true });
		}
	});
}

/**
 * @brief Creates a character selection loop for a player.
 * 
 * This function allows a player to cycle through available characters using previous and next buttons.
 * 
 * @param player_number The player number for which the character loop is created. Defaults to 1.
 */
export function createCharacterLoop(player_number: number = 1) {
	const characters: string[] = [
		'mario.png',
		'yoshi.png',
		'donkey_kong.png',
		'pikachu.png',
		'mewtwo.png',
		'link.png',
		'sonic.png',
		'samus.png'
	];

	const location: string = "./static/character_select/";

	let currentCharacterIndex: number = 0;

	const prevButton: HTMLButtonElement | null = document.getElementById(`prev-character-${player_number}`) as HTMLButtonElement;
	const nextButton: HTMLButtonElement | null = document.getElementById(`next-character-${player_number}`) as HTMLButtonElement;
	const characterDisplay: HTMLImageElement | null = document.getElementById(`character-img-${player_number}`) as HTMLImageElement;

	function updateCharacterDisplay(): void {
		if (characterDisplay)
			characterDisplay.src = location + characters[currentCharacterIndex];
	}

	// Event listener for previous button
	if (prevButton) {
		prevButton.addEventListener('click', () => {
			// Decrement the index and cycle back to the end if necessary
			currentCharacterIndex = (currentCharacterIndex === 0) ? characters.length - 1 : currentCharacterIndex - 1;
			updateCharacterDisplay();
		});
	}

	// Event listener for next button
	if (nextButton) {
		nextButton.addEventListener('click', () => {
			// Increment the index and cycle back to the start if necessary
			currentCharacterIndex = (currentCharacterIndex === characters.length - 1) ? 0 : currentCharacterIndex + 1;
			updateCharacterDisplay();
		});
	}

	// Initialize the first character
	updateCharacterDisplay();
}

/**
 * @brief Creates a background selection loop.
 * 
 * This function allows the user to cycle through available backgrounds using previous and next buttons.
 */
export function createBackgroundLoop() {
	const backgrounds: string[] = [
		'Backyard.png',
		'Beach.png',
		'Cave.png',
		'Checks.png',
		'City.png',
		'Desert.png',
		'Forest.png',
		'Machine.png',
		'Nostalgic.png',
		'Pikapika_Platinum.png',
		'River.png',
		'Savanna.png',
		'Seafloor.png',
		'Simple.png',
		'Sky.png',
		'Snow.png',
		'Space.png',
		'Torchic.png',
		'Volcano.png'
	];

	const location: string = "./static/backgrounds/";

	let currentBackgroundIndex: number = 0;

	const prevButton: HTMLButtonElement | null = document.getElementById('prev-background') as HTMLButtonElement;
	const nextButton: HTMLButtonElement | null = document.getElementById('next-background') as HTMLButtonElement;
	const backgroundDisplay: HTMLDivElement | null = document.getElementById('background-img') as HTMLDivElement;

	function updateBackgroundDisplay(): void {
		if (backgroundDisplay)
			backgroundDisplay.style.backgroundImage = `url('${location}${backgrounds[currentBackgroundIndex]}`;
	}

	// Event listener for previous button
	if (prevButton) {
		prevButton.addEventListener('click', () => {
			// Decrement the index and cycle back to the end if necessary
			currentBackgroundIndex = (currentBackgroundIndex === 0) ? backgrounds.length - 1 : currentBackgroundIndex - 1;
			updateBackgroundDisplay();
		});
	}

	// Event listener for next button
	if (nextButton) {
		nextButton.addEventListener('click', () => {
			// Increment the index and cycle back to the start if necessary
			currentBackgroundIndex = (currentBackgroundIndex === backgrounds.length - 1) ? 0 : currentBackgroundIndex + 1;
			updateBackgroundDisplay();
		});
	}

	// Initialize the first character
	updateBackgroundDisplay();
}
