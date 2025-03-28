import { wait } from "./helpers.js"

export async function addLandingAnimations(): Promise<void> {
    await wait(1);
    const enterButton = document.getElementById("enter-button");
    enterButton?.classList.add("fade-in");
    enterButton?.classList.add("animate-bounce");
}
