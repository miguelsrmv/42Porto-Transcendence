// app.ts

/**
 * 
 * @brief Event listener for DOMContentLoaded
 * It will trigger the loading of the default page when the DOM content is fully loaded and parsed
 */
document.addEventListener("DOMContentLoaded", () => {
    loadPage("home.html"); // Load default page on startup
});

/**
 * 
 * @brief Loads a specified HTML page into the #app element
 */
async function loadPage(page: string): Promise<void> {
    const app = document.getElementById("app") as HTMLElement | null;

    if (!app) {
        console.log("Error: app not found");
        return;
    }

    try {
        // Fetch the page content
        const response = await fetch("pages/" + page);
        if (!response.ok) throw new Error("Page not found");

        // Load content into #app with fade transition
        app.style.opacity = "0";
        setTimeout(async () => {
            app.innerHTML = await response.text();
            app.style.opacity = "1";
        }, 300); // Small delay for smooth transition
    } catch (error) {
        app.innerHTML = "<p class='text-red-500'>Error loading page.</p>";
        console.error(error);
    }
}
