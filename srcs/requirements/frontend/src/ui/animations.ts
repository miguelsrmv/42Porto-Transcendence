import { wait } from "../utils/helpers.js"

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
   const subTitle = document.getElementById("sub-title");
   const enterButton = document.getElementById("enter-button");

   await wait(1);

   subTitle?.classList.remove("opacity-0", "invisible")
   subTitle?.classList.add("fade-in");

   await wait(1);

   enterButton?.classList.remove("opacity-0", "invisible")
   enterButton?.classList.add("fade-in");
   enterButton?.classList.add("animate-bounce");
}
