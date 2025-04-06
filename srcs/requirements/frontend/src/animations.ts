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

export function addMenuHelperText(menu: HTMLElement, message: string): void {
    const menuHelperText = document.getElementById("menu-helper-text");

    if (menuHelperText) {
        menu.addEventListener("mouseover", () => {
            menuHelperText.innerHTML = message;
        })
        menu.addEventListener("mouseout", () => {
            menuHelperText.innerHTML = "";
        })
    }
}
