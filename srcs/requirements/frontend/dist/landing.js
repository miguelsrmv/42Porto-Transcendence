var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { wait } from "./helpers.js";
export function addLandingAnimations() {
    return __awaiter(this, void 0, void 0, function* () {
        yield wait(1);
        const enterButton = document.getElementById("enter-button");
        enterButton === null || enterButton === void 0 ? void 0 : enterButton.classList.add("fade-in");
        enterButton === null || enterButton === void 0 ? void 0 : enterButton.classList.add("animate-bounce");
    });
}
//# sourceMappingURL=landing.js.map