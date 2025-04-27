/**
 * @file animations.ts
 * @brief Provides functions to add animations to UI elements on the landing page.
 *
 * This module includes functions that apply various animations to elements on the landing page,
 * enhancing the user experience with visual effects.
 */

import { wait } from '../utils/helpers.js';

/**
 * @brief Adds animations to the landing page elements.
 *
 * This asynchronous function applies fade-in and bounce animations to the subtitle
 * and enter button elements on the landing page. It waits for a specified duration
 * between animations to ensure a smooth transition.
 *
 * The function first removes the "opacity-0" and "invisible" classes from the subtitle
 * and enter button, then adds the "fade-in" class to both elements. Additionally, it
 * adds the "animate-bounce" class to the enter button to create a bouncing effect.
 *
 * @return A promise that resolves when the animations have been added.
 */

export async function setLandingAnimations(): Promise<void> {
  const subTitle = document.getElementById('sub-title');
  const enterButton = document.getElementById('enter-button');

  // Ensure elements exist before trying to animate
  if (!subTitle || !enterButton) {
    console.warn('Subtitle or Enter button not found for animations.');
    return;
  }

  try {
    // Animate Subtitle
    await wait(1); // Short delay before first animation
    subTitle.classList.remove('opacity-0', 'invisible');
    // The transition is handled by Tailwind classes in the HTML:
    // e.g., class="... transition-opacity duration-700 ease-in-out"

    // Animate Enter Button
    await wait(1); // Stagger the second animation
    enterButton.classList.remove('opacity-0', 'invisible');
    // Add bounce effect after it becomes visible
    enterButton.classList.add('animate-bounce'); // Tailwind's bounce animation
  } catch (error) {
    console.error('Error during landing animations:', error);
    // Ensure elements are visible even if animations fail
    subTitle?.classList.remove('opacity-0', 'invisible');
    enterButton?.classList.remove('opacity-0', 'invisible');
  }
}

export function fadeIn(element: HTMLElement): void {
  element.classList.remove('hidden');
  element.classList.remove('animate-fade-out');
  void element.offsetWidth; // <-- FORCE reflow (important!)
  element.classList.add('animate-fade-in');
}

export function fadeOut(element: HTMLElement): void {
  element.classList.remove('animate-fade-in');
  void element.offsetWidth; // <-- FORCE reflow
  element.classList.add('animate-fade-out');

  setTimeout(() => element.classList.add('hidden'), 500);
  // element.addEventListener('animationend', function handler() {
  //   element.classList.add('hidden');
  //   element.removeEventListener('animationend', handler);
  // });
}
