# File structure

```
backend/
|── dist/                           # Compiled files (after build)
|
|── node_modules/                   # Installed dependencies
|
|── prisma/                         # Prisma migrations and schema
|   |── migrations/
|   |──schema.prisma
|
|── scripts/                        # Custom scripts to interact with the database (e.g., DB seeding)
|   |── populate_db.ts
|
|── src/
|   |── api/                            # API logic for HTTP requests
|   |   |── controllers/                # Route handlers (separates logic from routes)
|   |   |   |── user.controller.ts
|   |   |── middlewares/                # Fastify middlewares (e.g., authentication)
|   |   |   |── auth.ts
|   |   |── routes/                     # API routes
|   |   |   |── user.routes.ts
|   |   |── schemas/                    # Schemas for validation
|   |   |   |── user.schemas.ts
|   |   |── services/                   # Business logic
|   |   |   |── user.schemas.ts
|   |   |── validation/                 # Validation logic for preHandler hooks
|   |   |   |── user.validation.ts
|   |── ws/                             # WebSocket handling
|   |   |── managers/                   # Manager classes
|   |   |   |── gameSessionManager.ts
|   |   |── handlers/                   # Handle WebSocket events
|   |   |   |── remoteGameRouter.ts
|   |   |── remoteGameApp/              # Remote game logic
|   |   |   |── game.ts
|   |   |── gameSession.ts              # Game Session class
|   |   |── helpers.ts                  # Helper functions
|   |   |── tournament.ts               # Tournament class
|   |   |── websocket.routes.ts         # Websocket routes
|   |── utils/                      # Utility functions/helpers
|   |   |── errorHandler.ts         # Error handling
|   |   |── hash.ts                 # Password hashing
|   |   |── helpers.ts              # Helper functions
|   |   |── prisma.ts               # Prisma client setup
|   |   |── prismaExtensions.ts     # Prisma extensions
|   |── app.ts                      # Fastify app setup
|   |── server.ts                   # Fastify instance setup
|   |── fastify.d.ts                # Declaration file to provide typescript type information about the Fastify app
|   |── types.ts                    # Custom types used throughout the Fastify app
|
|── tests/
|   |── requests/
|   |   |── curl_tests.txt          # Text file with requests to send with curl
|   |   |── user.http               # HTTP Requests for users endpoints (REST Client extension)
|   |── api_routes.test.ts          # Vitest test file
|
|── .dockerignore
|── .gitignore
|── .prettierrc                     # Prettier config
|── Dockerfile
|── eslint.config.mjs               # ESLint config
|── init.sh                         # Entrypoint script for the Docker container
|── NOTES.md
|── package-lock.json               # Project dependencies and versions
|── package.json                    # Project metadata
|── tsconfig.json                   # TypeScript config
|── vitest.config.ts                # Vitest config
```

# Useful commands

- `npx tsx <script.ts>` to execute a TS script
- `npx prisma migrate dev --name <migration_name>` to migrate changes to the database (it also generates a prisma client)
- `npx prisma migrate reset` to reset the database
- `npx prisma generate` to generate a new prisma client

## Scripts

- `npm run populate` to populate the database
- `npm run populate-tournament` to create a tournament 
- `npm run build` to compile ts files into js
- `npm run start` to launch the app (js)
- `npm run start-dev` to launch the app with nodemon (js)
- `npm run test` to run Vitest tests
- `npm run test-db` to test database is up and running
- `npm run db-reset` to reset the local database, apply any migrations, and generate a new prisma client instance
- `npm run tournament` to run a full tournament without UI
- `npm run open-tournament` to open 8 browser windows, log in users, and navigate to the join tournament page
- `npm run login-tournament` to open 8 browser windows and log in users

**Note:** The first time running playwright scripts, first run `npm install` to install dependencies and `npx playwright install firefox`. Then run `npm run build-dev` (to compile the ts file into js) and then run the script.

## Notes

- When testing locally, an `.env` file is required with the DATABASE_URL key, in the project root directory `.`
- If running locally for the first time, first run `npm install` to install all the project's dependencies
