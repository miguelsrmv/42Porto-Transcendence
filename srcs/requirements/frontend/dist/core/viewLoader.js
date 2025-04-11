import { getTemplateId } from "../utils/helpers.js";
export function loadView(viewName) {
    const templateId = getTemplateId(viewName);
    const templateHost = document.getElementById("app");
    const templateBlock = document.getElementById(templateId);
    if (!templateHost)
        throw new Error("Could not find the template host element with ID 'app'.");
    if (!templateBlock)
        throw new Error(`Could not find the template element with ID '${templateId}'.`);
    templateHost.replaceChildren(templateBlock.content.cloneNode(true));
}
//# sourceMappingURL=viewLoader.js.map