import { toggleDropdown } from "../ui/dropdown.js"

/**
*  @brief Adjusts the header size and content based on the current view.
*
*  This function modifies the header's height and content depending on whether the current view
*  is the landing page or another view.
*
*  @param view The ID of the current view.
*/
export function adjustHeader(view: string) {
   const header = document.getElementById("header");
   const headerTemplate = document.getElementById("header-template") as HTMLTemplateElement;

   if (!header)
      throw new Error("Could not find the header element with id 'header'.");

   if (!headerTemplate)
      throw new Error("Could not find the header template with id 'header-template'.");

   const isLandingPage = view === "landing-page";

   // Clean previous header heights
   header.classList.remove("h-[0%]", "h-[20%]");

   if (isLandingPage) {
      // Makes header invisible
      header.classList.add("h-[0%]");
      header.innerText = "";
   }
   else {
      // Makes header visible
      header.classList.add("h-[20%]");

      // Adds content from header template
      header.replaceChildren(headerTemplate.content.cloneNode(true));

      // Toggles dropdown
      toggleDropdown();

      // Updates headerText
      const headerText = header.querySelector("#header-menu-text");
      if (headerText) {
         headerText.innerHTML = view.replace("-page", "").split("-").map(view => view.charAt(0).toUpperCase() + view.slice(1)).join(" ");
      }
   }
}

