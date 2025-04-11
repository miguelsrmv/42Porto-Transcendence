# Project Structure Overview

## Directory Layout

```
src/
├── app.ts                  # Main application entry point
│
├── core/                   # Core functionalities like routing and view management
│   ├── router.ts           # Handles URL changes and navigation logic
│   └── viewLoader.ts       # Handles loading/rendering HTML templates/views
│
├── features/               # Feature-specific modules
│   ├── landing/
│   │   └── landing.ts        # Landing page specific logic and animations
│   ├── auth/
│   │   ├── auth.service.ts   # Authentication logic, API calls, status management
│   │   └── loginModal.ts     # Login modal specific interactions
│   ├── mainMenu/
│   │   └── mainMenu.ts       # Main menu specific logic
│   ├── game/
│   │   └── gameSetup.ts      # Game setup logic (type selection, player settings, character/background loops)
│   ├── friends/
│   │   └── friends.ts        # Friends page specific logic
│   └── rankings/
│       └── rankings.ts       # Rankings page specific logic
│
├── ui/                     # Reusable UI components and animations
│   ├── dropdown.ts         # Dropdown menu logic
│   ├── animations.ts       # Generic animation functions
│   └── helperText.ts       # Logic for the menu helper text
│
├── services/               # Shared services (e.g., API calls)
│   └── api.ts              # (Optional) Centralized API fetch logic
│
├── styles/                 # CSS files
│   └── tailwind.css        # Your existing Tailwind CSS
│
└── utils/                  # Utility functions
    └── helpers.ts          # General helper functions (like wait)
```

---

## Reorganization Goals

### ✅ Feature-Based Folders
Group files that belong to the same functionality under one directory.

### ✅ Separation of Concerns
Each module should have one job—routing, view rendering, service calls, UI interactions, etc.

### ✅ Scalable Entry Point
Keep `app.ts` minimal and focused on initializing the app.

### ✅ Utilities and Reusable Components
Shared services, components, and utilities should have clearly defined folders.

---

## Specific File Changes

- **`app.ts`**  
  ➤ Remains the entry point  
  ➤ Should import `initializeRouter` and run it inside `DOMContentLoaded`

- **`navigation.ts`** (removed)  
  ➤ Routing logic moved to `core/router.ts`  
  ➤ View rendering moved to `core/viewLoader.ts`  
  ➤ Event handlers moved to their respective feature files

- **`events.ts`** (removed)  
  ➤ Listener setup moved to `core/router.ts`  
  ➤ Dropdown logic moved to `ui/dropdown.ts`  
  ➤ Loops for character/background moved to `features/game/gameSetup.ts`

- **`animations.ts`**  
  ➤ Page-specific animations moved to relevant feature files  
  ➤ Generic ones remain in `ui/animations.ts`

- **`helpers.ts`**  
  ➤ Moved to `utils/helpers.ts`

- **`tailwind.css`**  
  ➤ Moved to `styles/tailwind.css`

---

## Notes on SPA Routing

- Uses the **HTML5 History API** and/or **hash fragments** (`#view`) to simulate navigation
- URL changes are handled by `router.ts` which:
  - Updates history state
  - Loads the right `<template>` using `viewLoader.ts`
  - Dynamically imports the appropriate `*.ts` file (e.g., `landing.ts`)
  - Calls that file’s `init` method to activate logic and attach events
