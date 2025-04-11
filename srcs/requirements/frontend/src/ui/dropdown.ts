/**
 * @brief Toggles the visibility of a dropdown menu.
 * 
 * This function manages the visibility of a dropdown menu associated with a button.
 * It toggles the dropdown's visibility when the button is clicked and hides the dropdown
 * when clicking outside of it.
 */
// TODO: If guest login, don't show Profile option!! And change "Log out" to "Exit"
export function toggleDropdown(): void {
   const button = document.getElementById("nav-settings-button");
   const dropdown = document.getElementById("settings-dropdown");

   if (!button || !dropdown) return;

   button.addEventListener("click", (e) => {
      e.stopPropagation();
      dropdown.classList.toggle("hidden");
   });

   document.addEventListener("click", (e: MouseEvent) => {
      const target = e.target as Node;
      if (!button.contains(target) && !dropdown.contains(target)) {
         dropdown.classList.add("hidden");
      }
   });
}


