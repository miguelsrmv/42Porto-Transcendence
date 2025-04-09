var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { wait } from "./helpers.js";
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
export function addLandingAnimations() {
    return __awaiter(this, void 0, void 0, function* () {
        const subTitle = document.getElementById("sub-title");
        const enterButton = document.getElementById("enter-button");
        yield wait(1);
        subTitle === null || subTitle === void 0 ? void 0 : subTitle.classList.remove("opacity-0", "invisible");
        subTitle === null || subTitle === void 0 ? void 0 : subTitle.classList.add("fade-in");
        yield wait(1);
        enterButton === null || enterButton === void 0 ? void 0 : enterButton.classList.remove("opacity-0", "invisible");
        enterButton === null || enterButton === void 0 ? void 0 : enterButton.classList.add("fade-in");
        enterButton === null || enterButton === void 0 ? void 0 : enterButton.classList.add("animate-bounce");
    });
}
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
//# sourceMappingURL=animations.js.map