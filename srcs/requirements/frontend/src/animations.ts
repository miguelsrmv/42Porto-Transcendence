import { wait } from "./helpers.js"

export async function addLandingAnimations(): Promise<void> {
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

export function addNavBarText(menu: HTMLElement, message: string): void {
    const navBarText = document.getElementById("nav-bar-text");

    if (navBarText) {
        menu.addEventListener("mouseover", () => {
            navBarText.innerHTML = message;
        })
        menu.addEventListener("mouseout", () => {
            navBarText.innerHTML = "";
        })
    }
}
