/**
 * @file router.ts
 * @brief Handles routing and navigation within the application.
 */

import { loadView } from './viewLoader.js';
import * as errorPageModule from '../features/error/error.js';
import * as landingPageModule from '../features/landing/landing.js';
import * as mainMenuModule from '../features/mainMenu/mainMenu.js';
import * as localPlayModule from '../features/localPlay/localPlay.js';
import * as remotePlayModule from '../features/remotePlay/remotePlay.js';
import * as tournamentPlayModule from '../features/tournamentPlay/tournamentPlay.js';
import * as friendModule from '../features/friends/friends.js';
import * as rankingsModule from '../features/rankings/rankings.js';
import * as settingsModule from '../features/settings/settings.js';
//import * as gameModule from '../features/game/gamePage.js';
import { endLocalGameIfRunning } from '../features/game/localGameApp/game.js';
//import { endRemoteGameIfRunning } from '../features/game/remoteGameApp/remoteGame.js';

type FeatureModule = {
  initializeView: () => void;
};

export const routes: { [key: string]: FeatureModule } = {
  'landing-page': landingPageModule as FeatureModule,
  'main-menu-page': mainMenuModule as FeatureModule,
  'local-play-page': localPlayModule as FeatureModule,
  'remote-play-page': remotePlayModule as FeatureModule,
  'tournament-play-page': tournamentPlayModule as FeatureModule,
  'friends-page': friendModule as FeatureModule,
  'rankings-page': rankingsModule as FeatureModule,
  'settings-page': settingsModule as FeatureModule,
  //  'game-page': gameModule as FeatureModule,
};

let currentView = '';

/**
 * @brief Handles changes in the route based on the URL hash.
 * @returns A promise that resolves when the view is loaded.
 */
// TODO: Handle non-logged-in direct access to restricted pages!
function handleRouteChange(): void {
  // If a local game is running, stop it
  endLocalGameIfRunning();

  // Get the view name from the URL hash, trim the first #
  const viewName = window.location.hash.substring(1) || 'landing-page';

  // If already on that view, do nothing
  if (viewName == currentView) {
    return;
  }

  // Update currentView
  currentView = viewName;

  // Attempt to load the HTML with loadView()
  try {
    loadView(viewName);
  } catch (error) {
    console.error(`Error loading page "${viewName}":`, error);
    loadView('error-page');
    errorPageModule.initializeView(404);
    return;
  }

  // Find the route function for import
  const featureModule = routes[viewName];

  if (featureModule) {
    if (featureModule.initializeView) {
      featureModule.initializeView();
    } else {
      // Warn of lack of initializeView function
      console.warn(`Module for ${viewName} loaded but has no initializeView function.`);
    }
  } else {
    // Handle unknown routes - redirect to landing page or a 404 view
    console.error(`No route defined for ${viewName}.`);
  }
}

export function forceRouteChange(viewName: string): void {
  // Find the route function for import
  const featureModule = routes[viewName];

  if (featureModule) {
    if (featureModule.initializeView) {
      featureModule.initializeView();
    } else {
      // Warn of lack of initializeView function
      console.warn(`Module for ${viewName} loaded but has no initializeView function.`);
    }
  } else {
    // Handle unknown routes - redirect to landing page or a 404 view
    console.error(`No route defined for ${viewName}.`);
  }
}

/**
 * @brief Handles click events on navigation links.
 * @param event The mouse event triggered by clicking a link.
 */
const handleLinkClick = (event: MouseEvent): void => {
  const target = event.target as HTMLElement;
  // Find the closest anchor tag with a data-target attribute
  const anchor = target.closest('a[data-target]') as HTMLAnchorElement | null;

  if (anchor) {
    event.preventDefault(); // Prevent default link behavior (full page load)
    const viewName = anchor.getAttribute('data-target');
    if (viewName) {
      navigate(viewName);
    }
  }
};

/**
 * @brief Handles the popstate event for browser navigation (back/forward).
 */
const handlePopState = (): void => {
  // When user clicks back/forward, handle the route change
  // The URL hash has already been updated by the browser
  handleRouteChange();
};

/**
 * @brief Navigates to a specified view.
 * @param viewName The name of the view to navigate to.
 * @param replace If true, replaces the current history state instead of adding a new one.
 */
export function navigate(viewName: string, replace: boolean = false): void {
  // Don't navigate if already there
  if ('#' + viewName === window.location.hash && !replace) {
    return;
  }

  const url = `#${viewName}`;
  const state = { view: viewName }; // Store view name in history state

  if (replace) {
    history.replaceState(state, '', url);
  } else {
    history.pushState(state, '', url);
  }

  // Manually trigger the route handling after updating the URL/history
  handleRouteChange();
}

/**
 * @brief Initializes the router by setting up event listeners and handling the initial route.
 */
export function initializeRouter() {
  // TODO: Uncomment, currently commented just for quick dev
  // If reload, send to main page
  // const navEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
  // if (navEntry?.type === 'reload') {
  //   // Send them to main menu instead
  //   window.location.replace('/');
  //   return;
  // }

  // Listen for clicks on potential navigation links
  document.addEventListener('click', handleLinkClick);

  // Listen for history changes (back/forward buttons)
  window.addEventListener('popstate', handlePopState);

  // Handle the initial route based on the URL when the app loads
  handleRouteChange();
}
