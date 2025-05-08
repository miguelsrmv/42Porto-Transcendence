/**
 * @file header.ts
 * @brief Manages the header UI component, adjusting its size and content based on the current view.
 *
 * This module provides functionality to dynamically modify the header's appearance and content
 * depending on the active view within the application. It ensures that the header is appropriately
 * displayed or hidden and updates its content to reflect the current view.
 */

import { toggleDropdown } from '../ui/dropdown.js';

/**
 *  @brief Adjusts the header size and content based on the current view.
 *
 *  This function modifies the header's height and content depending on the current view
 *
 *  @param view The ID of the current view.
 */
export async function adjustHeader(view: string) {
  const header = document.getElementById('header');
  const headerTemplate = document.getElementById('header-template') as HTMLTemplateElement;

  if (!header) throw new Error("Could not find the header element with id 'header'.");

  if (!headerTemplate)
    throw new Error("Could not find the header template with id 'header-template'.");

  const isLandingOrErrorPage: boolean = view === 'landing-page' || view === 'error-page';
  const isMainPage: boolean = view === 'main-menu-page';

  if (isLandingOrErrorPage) {
    // Makes header invisible
    header.classList.add('hidden');
    header.innerText = '';
  } else {
    // Makes header visible
    header.classList.remove('hidden');

    // Adds content from header template
    header.replaceChildren(headerTemplate.content.cloneNode(true));

    // Toggles dropdown
    toggleDropdown();

    // Updates headerText
    const headerText = header.querySelector('#header-menu-text');
    if (headerText) {
      headerText.innerHTML = view
        .replace('-page', '')
        .split('-')
        .map((view) => view.charAt(0).toUpperCase() + view.slice(1))
        .join(' ');
    }

    let headerUserName = header.querySelector('#player-name') as HTMLElement;
    headerUserName.innerText = window.localStorage.getItem('Username') as string;
    if (!headerUserName.innerText) headerUserName.innerText = 'Guest';

    // Shows back button if not on main page
    if (!isMainPage) {
      const headerBackButton = document.getElementById('header-back-button');
      if (!headerBackButton)
        throw new Error("Could not find the header template with id 'header-back-button'.");
      headerBackButton.classList.remove('hidden');
      headerBackButton.onclick = () => {
        window.history.back();
      };
    }
  }
}
