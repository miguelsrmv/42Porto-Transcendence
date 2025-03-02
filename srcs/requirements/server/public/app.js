"use strict";
// app.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
function loadPage(page) {
    return __awaiter(this, void 0, void 0, function* () {
        const app = document.getElementById("app");
        if (!app) {
            console.log("Error: app not found");
            return;
        }
        try {
            // Fetch the page content
            const response = yield fetch("pages/" + page);
            if (!response.ok)
                throw new Error("Page not found");
            // Load content into #app with fade transition
            app.style.opacity = "0";
            setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                app.innerHTML = yield response.text();
                app.style.opacity = "1";
            }), 300); // Small delay for smooth transition
        }
        catch (error) {
            app.innerHTML = "<p class='text-red-500'>Error loading page.</p>";
            console.error(error);
        }
    });
}
