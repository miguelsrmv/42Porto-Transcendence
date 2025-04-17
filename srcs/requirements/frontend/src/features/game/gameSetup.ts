/**
 * @file gameSetup.ts
 * @brief Handles the setup of game types, character selection, and background selection for the game.
 *
 * This module provides functions to configure game settings, including selecting game types,
 * characters, and backgrounds. It also manages user interactions for these selections.
 */

type gameSettingKey =
  | 'playType'
  | 'gameType'
  | 'player1Alias'
  | 'player1PaddleColour'
  | 'player1Character'
  | 'player2Alias'
  | 'player2PaddleColour'
  | 'player2Character'
  | 'background'
  | 'gameType';

export const gameSettings: Record<gameSettingKey, string | null> = {
  playType: null,
  gameType: null,
  player1Alias: null,
  player1PaddleColour: null,
  player1Character: null,
  player2Alias: null,
  player2PaddleColour: null,
  player2Character: null,
  background: null,
};

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
    const classicButton = document.getElementById('classic-pong-button');
    const crazyButton = document.getElementById('crazy-pong-button');

    if (classicButton && crazyButton) {
      classicButton.addEventListener(
        'click',
        () => {
          resolve('classic');
        },
        { once: true },
      );
      crazyButton.addEventListener(
        'click',
        () => {
          resolve('crazy');
        },
        { once: true },
      );
    }
  });
}

/**
 * @brief Creates a character selection loop for a player.
 *
 * This function allows a player to cycle through available characters using previous and next buttons.
 * It updates the character display based on user interaction.
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
    'samus.png',
  ];

  const location: string = './static/character_select/';

  let currentCharacterIndex: number = 0;

  const prevButton: HTMLButtonElement | null = document.getElementById(
    `prev-character-${player_number}`,
  ) as HTMLButtonElement;
  const nextButton: HTMLButtonElement | null = document.getElementById(
    `next-character-${player_number}`,
  ) as HTMLButtonElement;
  const characterDisplay: HTMLImageElement | null = document.getElementById(
    `character-img-${player_number}`,
  ) as HTMLImageElement;

  function updateCharacterDisplay(): void {
    if (characterDisplay) characterDisplay.src = location + characters[currentCharacterIndex];
  }

  // Event listener for previous button
  if (prevButton) {
    prevButton.addEventListener('click', () => {
      // Decrement the index and cycle back to the end if necessary
      currentCharacterIndex =
        currentCharacterIndex === 0 ? characters.length - 1 : currentCharacterIndex - 1;
      updateCharacterDisplay();
    });
  }

  // Event listener for next button
  if (nextButton) {
    nextButton.addEventListener('click', () => {
      // Increment the index and cycle back to the start if necessary
      currentCharacterIndex =
        currentCharacterIndex === characters.length - 1 ? 0 : currentCharacterIndex + 1;
      updateCharacterDisplay();
    });
  }

  // Initialize the first character
  updateCharacterDisplay();

  // TODO: Update the Character sub text!!
}

/**
 * @brief Creates a background selection loop.
 *
 * This function allows the user to cycle through available backgrounds using previous and next buttons.
 * It updates the background display based on user interaction.
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
    'Volcano.png',
  ];

  const location: string = './static/backgrounds/';

  let currentBackgroundIndex: number = 0;

  const prevButton: HTMLButtonElement | null = document.getElementById(
    'prev-background',
  ) as HTMLButtonElement;
  const nextButton: HTMLButtonElement | null = document.getElementById(
    'next-background',
  ) as HTMLButtonElement;
  const backgroundDisplay: HTMLImageElement | null = document.getElementById(
    'background-img',
  ) as HTMLImageElement;

  function updateBackgroundDisplay(): void {
    if (backgroundDisplay)
      backgroundDisplay.style.backgroundImage = `url('${location}${backgrounds[currentBackgroundIndex]}`;
  }

  // Event listener for previous button
  if (prevButton) {
    prevButton.addEventListener('click', () => {
      // Decrement the index and cycle back to the end if necessary
      currentBackgroundIndex =
        currentBackgroundIndex === 0 ? backgrounds.length - 1 : currentBackgroundIndex - 1;
      updateBackgroundDisplay();
    });
  }

  // Event listener for next button
  if (nextButton) {
    nextButton.addEventListener('click', () => {
      // Increment the index and cycle back to the start if necessary
      currentBackgroundIndex =
        currentBackgroundIndex === backgrounds.length - 1 ? 0 : currentBackgroundIndex + 1;
      updateBackgroundDisplay();
    });
  }

  // Initialize the first character
  updateBackgroundDisplay();
}

/**
 * @brief Sets the game settings based on user input.
 *
 * This function retrieves user input for game type, play type, player aliases, paddle colors, and character selections.
 * It updates the global game settings object with these values.
 *
 * @param gameType The type of game selected by the user.
 * @param playType The play type selected by the user.
 */
export function setGameSettings(gameType: string, playType: string) {
  gameSettings.gameType = gameType;
  gameSettings.playType = playType;

  const player1InputAlias = document.getElementById('player-1-alias') as HTMLInputElement;
  if (player1InputAlias) {
    console.log(player1InputAlias.value);
    gameSettings.player1Alias = player1InputAlias.value;
  } else console.warn('Player 1 alias input form not found');

  const player1PaddleColour = document.getElementById(
    'player-1-paddle-colour-input',
  ) as HTMLInputElement;
  if (player1PaddleColour) {
    console.log(player1PaddleColour.value);
    gameSettings.player1PaddleColour = player1PaddleColour.value;
  } else console.warn('Player 1 paddle colour input form not found');

  const background = document.getElementById('background-img') as HTMLImageElement;
  if (background) {
    gameSettings.background = background.src;
  } else {
    console.warn('Background image not found');
  }

  // TODO: I don't want to get an image, I want to get the character!!
  // Create a type that routes Character -> Picture -> Attack and have it as a custom HTML field??
  if (gameSettings.gameType === 'crazy') {
    const player1Character = document.getElementById('character-img-1') as HTMLImageElement;
    if (player1Character) gameSettings.player1Character = player1Character.src;
    else {
      console.warn('Player 1 character not found');
    }
  }

  if (gameSettings.playType === 'local') {
    const player2InputAlias = document.getElementById('player-2-alias') as HTMLInputElement;
    if (player2InputAlias) gameSettings.player2Alias = player2InputAlias.value;
    else console.warn('Player 2 alias input form not found');

    const player2PaddleColour = document.getElementById(
      'player-2-paddle-colour-input',
    ) as HTMLInputElement;
    if (player2PaddleColour) gameSettings.player2PaddleColour = player2PaddleColour.value;
    else console.warn('Player 2 paddle colour input form not found');

    // TODO: I don't want to get an image, I want to get the character!!
    // Create a type that routes Character -> Picture -> Attack and have it as a custom HTML field??
    if (gameSettings.gameType === 'crazy') {
      const player2Character = document.getElementById('character-img-2') as HTMLImageElement;
      if (player2Character) gameSettings.player2Character = player2Character.src;
    }
  }
}

/**
 * @brief Retrieves the current game settings.
 *
 * This function returns the current configuration of game settings, including game type, play type,
 * player aliases, paddle colors, and character selections.
 *
 * @return The current game settings object.
 */
export function getGameSettings() {
  return gameSettings;
}
