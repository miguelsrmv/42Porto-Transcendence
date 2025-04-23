// Function to trigger power-up animation
export function triggerPowerAnimation() {
    const portrait = document.getElementById('left-character-portrait');
    const powerBar = document.getElementById('left-character-power-bar-fill');
    let currentPower;
    // Play mushroom sound effect (optional)
    // const mushroomSound = new Audio('path/to/mushroom-power-sound.mp3');
    // mushroomSound.play();
    // Add the growth animation class
    if (portrait)
        portrait.classList.add('power-up');
    // Store the current power level
    if (powerBar) {
        currentPower = parseFloat(powerBar.style.width) || 45; // Default from your HTML }
        // Increase the power bar (mushrooms increase power)
        const newPower = Math.min(currentPower + 25, 100); // Increase by 25%, cap at 100%
        // Add transition class and change width
        if (powerBar) {
            powerBar.classList.add('power-increase');
            powerBar.style.width = newPower + '%';
        }
        // Add a subtle pulsing red border to match Mario's colors
        if (portrait) {
            portrait.style.borderColor = '#ff0000';
            portrait.style.borderWidth = '6px';
            // Remove animation classes after they complete
            setTimeout(() => {
                portrait.classList.remove('power-up');
                // Add subtle shimmer effect as final touch
                portrait.classList.add('final-shimmer');
                setTimeout(() => {
                    portrait.classList.remove('final-shimmer');
                }, 600);
            }, 800);
            // Optional: Add small jump when animation ends
            setTimeout(() => {
                portrait.animate([
                    { transform: 'translateY(0)' },
                    { transform: 'translateY(-10px)' },
                    { transform: 'translateY(0)' },
                ], {
                    duration: 300,
                    easing: 'ease-in-out',
                });
            }, 900);
        }
    }
}
//# sourceMappingURL=attackAnimations.js.map