/**
 * @file footer.ts
 * @brief Adjusts the visibility of the footer based on the current view.
 *
 * This file contains a function to show or hide the footer element depending on whether
 * the current view is a landing page or an error page.
 */

/**
 * @brief Adjusts the footer visibility.
 *
 * This function shows the footer if the current view is either a landing page or an error page.
 * Otherwise, it hides the footer.
 *
 * @param view The current view of the application, used to determine footer visibility.
 * @throws Will throw an error if the footer element cannot be found.
 */
export function adjustFooter(view: string): void {
  const isLandingOrErrorPage: boolean = view === 'landing-page' || view === 'error-page';

  const footer = document.getElementById('footer');

  if (!footer) throw new Error("Could not find the footer element with id 'footer'.");

  if (isLandingOrErrorPage) {
    footer.classList.remove('hidden');
  } else {
    footer.classList.add('hidden');
  }
}
