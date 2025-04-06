export function wait(seconds: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}

export function removeHeightClasses(element: HTMLElement | null) {
    if (!element) return;
    element.classList.forEach(cls => {
        if (/^h-\[\d+%?\]$/.test(cls) || cls === "h-[full]" || cls === "h-full") {
            element.classList.remove(cls);
        }
    });
}
