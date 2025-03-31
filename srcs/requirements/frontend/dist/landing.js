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
        const subTitle = document.getElementById("sub-title");
        const enterButton = document.getElementById("enter-button");
        yield wait(1);
        subTitle === null || subTitle === void 0 ? void 0 : subTitle.classList.remove("opacity-0", "invisible");
        subTitle === null || subTitle === void 0 ? void 0 : subTitle.classList.add("fade-in");
        yield wait(1);
        enterButton === null || enterButton === void 0 ? void 0 : enterButton.classList.remove("opacity-0", "invisible");
        enterButton === null || enterButton === void 0 ? void 0 : enterButton.classList.add("fade-in");
        enterButton === null || enterButton === void 0 ? void 0 : enterButton.classList.add("animate-bounce");
    });
}
//# sourceMappingURL=landing.js.map