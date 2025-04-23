// TODO: Check why the power bar sometimes activates out of nowhere
// TODO: Try to export the animations to tailwindcss or tailwind.config.js
export function activatePowerBarAnimation(side: string) {
  const powerBarFill = document.getElementById(`${side}-character-power-bar-fill`);
  if (!powerBarFill) {
    console.warn(`PowerBar Fill in the ${side} not found`);
    return;
  }

  const originalColor = powerBarFill.className.match(/border-([a-z]+)-500/)?.[1];

  powerBarFill.style.animation = 'none'; // Reset animation

  // Force a reflow to ensure the animation reset takes effect
  void powerBarFill.offsetWidth;

  // Set the CSS animation
  powerBarFill.style.animation = 'powerPulse 2s ease-in-out infinite';

  // Add a data attribute to store original color
  powerBarFill.dataset.originalColor = originalColor;

  // Create and add the keyframe animation if it doesn't exist
  if (!document.getElementById('power-pulse-keyframes')) {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'power-pulse-keyframes';
    styleSheet.textContent = `
      @keyframes powerPulse {
        0%, 100% { background-color: ${originalColor}; }
        50% { background-color: white; }
      }
    `;
    document.head.appendChild(styleSheet);
  }
}

export function deactivatePowerBarAnimation(side: string) {
  const powerBarFill = document.getElementById(`${side}-character-power-bar-fill`);
  if (!powerBarFill) {
    console.warn(`PowerBar Fill in the ${side} not found`);
    return;
  }
  // Stop the animation
  powerBarFill.style.animation = 'none';
}

export function powerUpAnimation(side: string) {
  const portrait = document.getElementById(`${side}-character-portrait`);
  const powerBar = document.getElementById(`${side}-character-power-bar-fill`);

  if (!portrait) return; // Exit if portrait not found

  // Extract the current border color to use in the animation
  const computedStyle = window.getComputedStyle(portrait);
  const borderColor = computedStyle.borderColor;

  // Set the color property to the border color for use with currentColor in CSS
  portrait.style.color = borderColor;

  // Add the power-up animation class
  portrait.classList.add('power-up');

  // Handle power bar animation if it exists
  if (powerBar) {
    // Get current power or use default
    const currentPower = parseFloat(powerBar.style.width) || 45;

    // Calculate new power (increase by 25%, cap at 100%)
    const newPower = Math.min(currentPower + 25, 100);

    // Apply animation class and set new width
    powerBar.classList.add('power-increase');
    powerBar.style.width = newPower + '%';
  }

  // Temporarily increase border width for emphasis
  portrait.style.borderWidth = '6px';

  // Remove power-up animation class after it completes
  setTimeout(() => {
    portrait.classList.remove('power-up');

    // Add final shimmer effect
    portrait.classList.add('final-shimmer');

    // Remove shimmer after it completes
    setTimeout(() => {
      portrait.classList.remove('final-shimmer');
      // Optional: Reset border width to original after animations complete
      // portrait.style.borderWidth = originalBorderWidth;
    }, 600);
  }, 800);

  // Add small jump when animation ends for that extra touch
  setTimeout(() => {
    portrait.animate(
      [
        { transform: 'translateY(0)' },
        { transform: 'translateY(-10px)' },
        { transform: 'translateY(0)' },
      ],
      {
        duration: 300,
        easing: 'ease-in-out',
      },
    );
  }, 900);
}

export function scoreAnimation(side: string) {
  const hud = document.getElementById(`${side}-player-hud`);
  if (!hud) {
    console.warn(`Hud on the ${side} not found`);
    return;
  }

  hud.style.animation = 'none'; // Reset animation

  // Force a reflow to ensure the animation reset takes effect
  void hud.offsetWidth;

  // Set the CSS animation
  hud.style.animation = 'hudPulse 0.5s ease-in-out';

  // Create and add the keyframe animation if it doesn't exist
  if (!document.getElementById('hud-pulse-keyframes')) {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'hud-pulse-keyframes';
    styleSheet.textContent =
      '@keyframes hudPulse { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.1); opacity: 0.8; } }';
    document.head.appendChild(styleSheet);
  }
}
