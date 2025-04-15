/**
 * @file animations.ts
 * @brief Provides functions to add animations to UI elements on the landing page.
 *
 * This module includes functions that apply various animations to elements on the landing page,
 * enhancing the user experience with visual effects.
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { wait } from "../utils/helpers.js";
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
export function setLandingAnimations() {
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
//# sourceMappingURL=animations.js.map