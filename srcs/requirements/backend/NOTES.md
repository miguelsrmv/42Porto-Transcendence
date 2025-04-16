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
|   |── controllers/                # Business logic (separates logic from routes)
|   |   |── user.controller.ts
|   |── middlewares/                # Fastify middlewares (e.g., authentication)
|   |   |── auth.ts
|   |── routes/                     # API routes
|   |   |── user.routes.ts
|   |── schemas/                    # Schemas for validation
|   |   |── user.schemas.ts
|   |── services/                   # Business logic
|   |   |── user.schemas.ts
|   |── utils/                      # Utility functions/helpers
|   |   |── defaults.ts             # Default values for non-entities
|   |   |── errorHandler.ts         # Error handling
|   |   |── hash.ts                 # Password hashing
|   |   |── prisma.ts               # Prisma client setup
|   |   |── prismaExtensions.ts     # Prisma extensions
|   |── validation/                 # Validation logic for preHandler hooks
|   |   |── user.validation.ts
|   |── app.ts                      # Fastify app setup
|   |── server.ts                   # Fastify instance setup
|   |── fastify.d.ts                # Declaration file to provide typescript type information about the Fastify app
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
- `npm run test` to run Vitest tests
- `npm run populate` to populate the database
- `npm run build` to compile ts files into js
- `npm run build-dev` to compile ts files into js in watch mode for hot reload
- `npm run dev` to launch the app locally (directly from ts file)
- `npm run start` to launch the app (js)
- `npm run start-dev` to launch the app with nodemon (js)

## Notes

- When testing locally, an `.env` file is required with the DATABASE_URL key, in the project root directory `.`
- If running locally for the first time, first run `npm install` to install all the project's dependencies

## TODOs

- Improve error messages and object sent to frontend

- Test edge cases
- Add match creation logic in tournaments
- Add more tests