/**
 * @file dropdown.ts
 * @brief Provides functionality to toggle the visibility of a dropdown menu in the UI.
 *
 * This module includes functions that manage the display of dropdown menus, enhancing
 * user interaction by allowing elements to be shown or hidden based on user actions.
 */
import { logoutUser } from '../features/auth/logout.js';
/**
 * @brief Toggles the visibility of a dropdown menu.
 *
 * This function manages the visibility of a dropdown menu associated with a button.
 * It toggles the dropdown's visibility when the button is clicked and hides the dropdown
 * when clicking outside of it.
 */
// TODO: If guest login, don't show Profile option!! And change "Log out" to "Exit"
export function toggleDropdown() {
    const button = document.getElementById('nav-settings-button');
    const dropdown = document.getElementById('settings-dropdown');
    if (!button || !dropdown)
        return;
    button.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown.classList.toggle('hidden');
    });
    document.addEventListener('click', (e) => {
        const target = e.target;
        if (!button.contains(target) && !dropdown.contains(target)) {
            dropdown.classList.add('hidden');
        }
    });
    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', async () => {
            await logoutUser();
            window.location.hash = '#';
            // TODO: Put this function on auth.service.ts ?
        });
    }
}
//# sourceMappingURL=dropdown.js.map