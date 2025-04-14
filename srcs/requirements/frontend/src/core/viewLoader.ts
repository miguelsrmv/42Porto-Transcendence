/**
 * @file viewLoader.ts
 * @brief Provides functionality to load and display different views in the application.
 */

import { getTemplateId } from "../utils/helpers.js"
import { adjustHeader } from "../ui/header.js"

/**
 * @brief Loads a specified view into the application.
 * 
 * This function retrieves the template ID for the given view name, finds the corresponding
 * template element, and replaces the content of the main application container with the
 * template's content. It also adjusts the header to match the current view.
 * 
 * @param viewName The name of the view to load.
 * @throws Will throw an error if the template host or template block cannot be found.
 */
export function loadView(viewName: string) {
    const templateId = getTemplateId(viewName);

    const templateHost = document.getElementById("app");
    const templateBlock = document.getElementById(templateId as string) as HTMLTemplateElement;

    if (!templateHost)
        throw new Error("Could not find the template host element with ID 'app'.");

    if (!templateBlock)
        throw new Error(`Could not find the template element with ID '${templateId}'.`);

    templateHost.replaceChildren(templateBlock.content.cloneNode(true));

    // Adjusts Header
    adjustHeader(viewName);
}
