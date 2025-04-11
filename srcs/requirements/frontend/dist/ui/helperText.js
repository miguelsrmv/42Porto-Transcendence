/**
 * @brief Adds helper text to a menu element.
 *
 * This function attaches mouseover and mouseout event listeners to a menu element.
 * When the mouse is over the menu, a helper text message is displayed in the element
 * with the ID "menu-helper-text". The message is cleared when the mouse leaves the menu.
 *
 * @param menu The menu element to which the helper text will be added.
 * @param message The helper text message to display when the menu is hovered over.
 */
export function showMenuHelperText(anchor) {
    const menuHelperText = document.getElementById("menu-helper-text");
    if (menuHelperText) {
        const message = anchor.getAttribute("data-helper-message") || "Default helper text";
        anchor.addEventListener("mouseover", () => {
            menuHelperText.innerHTML = message;
        });
        anchor.addEventListener("mouseout", () => {
            menuHelperText.innerHTML = "";
        });
    }
}
//# sourceMappingURL=helperText.js.map