/**
 * @brief Pauses execution for a specified number of seconds.
 * 
 * This function returns a promise that resolves after a given number of seconds,
 * effectively pausing the execution of asynchronous code for the specified duration.
 * 
 * @param seconds The number of seconds to wait before the promise resolves.
 * @return A promise that resolves after the specified delay.
 */
export function wait(seconds: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}

export function getTemplateId(templateHost: string): string | undefined {
    switch (templateHost) {
        case "header":
            return "header-template";
        case "landing-page":
            return "landing-template";
        case "main-menu-page":
            return "main-menu-template";
        case "local-play-page":
        case "remote-play-page":
        case "tournament-play-page":
            return "game-menu-template";
        case "profile-page":
            return "profile-template";
        case "friends-page":
            return "friends-template";
        case "rankings-template":
            return "rankings-template";
    }
}

