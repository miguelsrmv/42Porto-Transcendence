export async function getGameType() {
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
export function createCharacterLoop(player_number = 1) {
    const characters = [
        'mario.png',
        'yoshi.png',
        'donkey_kong.png',
        'pikachu.png',
        'mewtwo.png',
        'link.png',
        'sonic.png',
        'samus.png'
    ];
    const location = "./static/character_select/";
    let currentCharacterIndex = 0;
    const prevButton = document.getElementById(`prev-character-${player_number}`);
    const nextButton = document.getElementById(`next-character-${player_number}`);
    const characterDisplay = document.getElementById(`character-img-${player_number}`);
    function updateCharacterDisplay() {
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
export function createBackgroundLoop() {
    const backgrounds = [
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
    const location = "./static/backgrounds/";
    let currentBackgroundIndex = 0;
    const prevButton = document.getElementById('prev-background');
    const nextButton = document.getElementById('next-background');
    const backgroundDisplay = document.getElementById('background-img');
    function updateBackgroundDisplay() {
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
//# sourceMappingURL=gameSetup.js.map