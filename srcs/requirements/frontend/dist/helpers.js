export function wait(seconds) {
    return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}
export function removeHeightClasses(element) {
    if (!element)
        return;
    element.classList.forEach(cls => {
        if (/^h-\[\d+%?\]$/.test(cls) || cls === "h-[full]" || cls === "h-full") {
            element.classList.remove(cls);
        }
    });
}
//# sourceMappingURL=helpers.js.map