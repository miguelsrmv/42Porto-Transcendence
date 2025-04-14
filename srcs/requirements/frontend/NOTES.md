# Project Structure Overview

## Directory Layout
````
frontend/
├── dist                            # Contains the compiled/built output of the source code
├── Dockerfile                      # Instructions to build the Docker image
├── nginx                           # Nginx web server configuration
│   ├── frontend_setup.sh           # Setup script for the frontend in Nginx environment
│   └── nginx_template.conf         # Nginx configuration template file
── src                              # Source code directory (pre-compilation)
│   ├── app.ts                      # Main application entry point 
│   ├── core                        # Core application logic 
│   │   ├── router.ts               
│   │   └── viewLoader.ts           
│   ├── features                    # Feature-specific modules 
│   │   ├── auth                    # Authentication feature 
│   │   │   ├── auth.service.ts     
│   │   │   └── loginModal.ts       
│   │   ├── friends                 # Friends page 
│   │   │   └── friends.ts          
│   │   ├── game                    # Game feature 
│   │   │   └── gameSetup.ts        
│   │   ├── landing                 # Landing page 
│   │   │   └── landing.ts          
│   │   ├── localPlay               # Local play 
│   │   │   └── localPlay.ts        
│   │   ├── mainMenu                # Main menu 
│   │   │   └── mainMenu.ts         
│   │   ├── rankings                # Rankings page 
│   │   │   └── rankings.ts         
│   │   ├── remotePlay              # Remote play page 
│   │   │   └── remotePlay.ts       
│   │   └── tournamentPlay          # Tournament play page 
│   │       └── tournamentPlay.ts   
│   ├── services                    # API Service logic 
│   │   └── api.ts                  
│   ├── styles                      # Source CSS/styling files
│   │   └── tailwind.css            
│   ├── ui                          # Reusable UI components 
│   │   ├── animations.ts           
│   │   ├── dropdown.ts             
│   │   ├── header.ts               
│   │   └── helperText.ts           
│   └── utils                       # Utility functions 
│       └── helpers.ts              
├── static                          # Static assets (images, fonts, etc.)
│   ├── avatar                      # User avatar images
│   │   ├── custom                  
│   │   └── default                 
│   ├── backgrounds                 # Background images for the application/game
│   ├── character_select            # Images for character selection screen
│   ├── favicon.ico                 # Application icon for browser tabs
│   ├── fonts                       # Font files used in the application
│   ├── icons                       # General icons
│   ├── images                      # General images used in the application
│   ├── index.html                  # Main HTML file for the single-page application
│   ├── others                      # Miscellaneous files, potentially design assets or references
│   └── super_smash_assets          # Assets related to Super Smash Bros., possibly for a theme or game elements
├── node_modules                    # Directory where npm packages are installed (dependencies)
├── package.json                    # Project metadata and dependencies list
├── package-lock.json               # Records exact versions of dependencies
├── Q&A.md                          # Markdown file, containing project-related questions or notes
├── tailwind.config.js              # Configuration file for Tailwind CSS
├── tsconfig.json                   # Configuration file for the TypeScript compiler
````

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

## Scripts
- `npm run dev-ts` to run typescript compiler in --watch mode (dev)
- `npm run dev-tailwind` to run tailwindcss compiler in --watch mode (dev)
- `npm run build` to run both compilers in one go (production)
