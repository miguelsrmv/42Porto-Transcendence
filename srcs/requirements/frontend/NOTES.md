# Project Structure Overview

This document provides a detailed overview of the frontend directory structure for the **ft_transcendence** project. Our frontend is a **Single Page Application (SPA)** built with TypeScript and styled with Tailwind CSS. It is designed to be modular, maintainable, and easy for new developers to navigate.

The architecture follows a **feature-based** (or **feature-slicing**) methodology, where code is organized by functionality rather than by file type. This keeps all related logic for a feature in one place.

## File Tree
.
├── Dockerfile
├── nginx/
│   ├── frontend_setup.sh
│   └── nginx_template.conf
├── NOTES.md
├── package.json
├── package-lock.json
├── src/
│   ├── app.ts
│   ├── constants/
│   ├── core/
│   ├── features/
│   ├── styles/
│   ├── ui/
│   └── utils/
├── static/
│   ├── avatar/
│   ├── backgrounds/
│   ├── character_portrait/
│   ├── character_select/
│   ├── favicon.ico
│   ├── fonts/
│   ├── images/
│   ├── index.html
│   └── super_smash_assets/
├── tailwind.config.js
└── tsconfig.json

Generated code
---

## 1. Top-Level Directory Structure

| Path                 | Description                                                                                                                                                             |
| :------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`/src`**           | The heart of the application, containing all the TypeScript source code that drives the application's logic and interactivity.                                          |
| **`/static`**        | Contains all public assets like images, fonts, and the main `index.html` file. These files are served directly to the browser without processing.                       |
| **`/nginx`**         | Configuration and setup scripts for the Nginx web server that serves the application in the production Docker container.                                                  |
| **`Dockerfile`**     | Instructions for building the frontend's production Docker image. It typically involves compiling the source code and setting up the Nginx server.                        |
| **`NOTES.md`**       | This documentation file, explaining the project structure.                                                                                                             |
| **`package.json`**   | Defines project metadata, scripts (`dev`, `build`), and lists all Node.js dependencies (e.g., TypeScript, Tailwind CSS) and dev dependencies.                             |
| **`tsconfig.json`**  | The configuration file for the TypeScript compiler (`tsc`), defining how `.ts` files are checked and transpiled into JavaScript.                                          |
| **`tailwind.config.js`** | The configuration file for customizing the Tailwind CSS framework, including custom colors, fonts, and plugins.                                                       |


---

## 2. The `/src` Directory: Application Source Code

This directory contains all the dynamic logic of our application. The structure is designed to separate concerns and group related code by feature.

### `app.ts`
The main entry point of the SPA. It is responsible for initializing the application, setting up the core router, and rendering the initial view.

### `/core`
This folder contains the application's "engine"—the foundational logic that is not tied to any specific business feature.
-   **`router.ts`**: Handles client-side routing, mapping URL paths to the correct feature/view.
-   **`viewLoader.ts`**: Manages the dynamic loading and rendering of HTML content into the main application container.

### `/features`
This is the most important directory. Each subdirectory represents a distinct feature or page. The architecture is highly modular, with many features having their own sub-folders for better organization and the inclusion of `.types.ts` files for enhanced type safety.

-   **/auth**: Handles authentication, including `auth.service.ts` for logic and `logout.ts` for user sign-out.
-   **/friends**: Manages the friends list. Now includes `friends.types.ts` to enforce a strict data structure for friend objects.
-   **/game**: The most complex feature, broken down into many sub-modules:
    -   `animations/`: Manages game-related visual effects.
    -   `backgroundData/`, `characterData/`: Holds data and types for selectable backgrounds and characters.
    -   `gameStats/`: Logic for handling the game conclusion screen and displaying match statistics.
    -   `localGameApp/`: **Crucially, this contains the entire engine for a local multiplayer game**. It handles ball physics, collision detection, player input, paddles, and more, all running in the client.
    -   `remoteGameApp/`: Contains the logic specific to **remote (online) games**, focusing on rendering state received from the server rather than calculating it. This separation of local vs. remote logic is key to managing complexity.
-   **/localTournamentPlay**: Manages the UI and event flow for local tournaments, including player menus and event handling.
-   **/settings**: A new feature for managing user preferences, including `2fa.ts`, `avatar.ts` for changing avatars, and `form.ts` for handling username changes.
-   Other features like `/rankings`, `/remotePlay`, etc., follow a similar pattern, often including a `.types.ts` file for type safety.

### `/services`
Abstracts away external communications, primarily with our backend API.
-   **`api.ts`**: A centralized service for making all HTTP requests, handling authorization headers, and managing API responses.

### `/ui`
Contains reusable UI components and logic shared across multiple features.
-   Includes `header.ts`, `footer.ts`, `dropdown.ts`, `controls.ts`, and new components like `tournamentStatus/` for displaying tournament brackets and `waitingNextGame.ts` for interstitial screens between matches.

### `/utils`
A collection of generic, reusable helper functions (e.g., DOM manipulation, data formatting) used throughout the application.

---

## 3. The `/static` Directory: Assets

This directory contains all files served directly by the web server. The asset library is not publicly available due to copyright.

-   **`index.html`**: The single HTML shell for the SPA.
-   **`/avatar`**: Contains a vast collection of default avatars for users to choose from (themed around Nintendo characters), as well as a location for custom-uploaded avatars.
-   **`/backgrounds`**: A wide variety of background images for game maps and application menus.
-   **`/character_portrait` & `/character_select`**: Themed character assets used in different UI contexts, such as in-game HUDs and selection screens.
-   **`/fonts`**: Custom fonts (e.g., Pokémon, Super Smash Bros. styles) that define the application's unique visual identity.

---

## 4. Build & Deployment

These files are crucial for creating and serving a production-ready version of our application.

-   **`Dockerfile`**: Defines a multi-stage build to compile the TypeScript project and serve the resulting static files in a lightweight `nginx` container.
-   **`/nginx`**: Contains the Nginx configuration, which is essential for routing all user navigation to `index.html` so the client-side router can take over, a standard practice for SPAs.
    -   **`nginx_template.conf`**: This is the core server configuration. It's essential for an SPA because it includes a `try_files` directive that redirects all navigation requests to `index.html`. This allows the client-side router in `src/core/router.ts` to handle the URL and render the correct view.
    -   **`frontend_setup.sh`**: This script likely runs when the Docker container starts. Its purpose is to take the `nginx_template.conf` and substitute any necessary environment variables (e.g., the backend API URL) into it, creating the final `nginx.conf` that the server will use. This makes the container's configuration flexible and portable across different environments.


## 5. Key Architectural Concepts

Beyond the file structure, several key architectural decisions shape this project.

### Feature-Sliced Design
As noted, the project is organized by "features" rather than by file type (e.g., putting all services in one folder, all components in another). This encapsulation means that to understand or modify the "Friends" page, a developer primarily needs to look inside the `src/features/friends/` directory. This makes the codebase easier to reason about and reduces the risk of unintended side effects.

### TypeScript for Type Safety
The extensive use of TypeScript, including dedicated `.types.ts` files (e.g., `friends.types.ts`), is a core principle. This provides:
-   **Compile-time error checking:** Catching bugs before the code is even run.
-   **Intelligent Code Completion:** Greatly improves developer productivity and reduces the need to look up data structures.
-   **Self-documenting Code:** The types themselves act as documentation for the expected shape of data (e.g., what properties a `User` object has).

### Separation of Game Logic (Local vs. Remote)
A critical and sophisticated design choice is the separation of the game engine within `src/features/game/`:
-   **`/localGameApp`**: This is the **complete game engine**. It contains all the physics, collision detection, player input handling, and state management needed to run a full game entirely on the client. It is the single source of truth for local multiplayer games.
-   **`/remoteGameApp`**: This module is significantly "dumber." Its primary job is to connect to the backend's WebSocket server and **render the game state** it receives. It does not run its own physics simulation. This client-server model prevents cheating in online matches, as the server is the single authority on the game's state.
