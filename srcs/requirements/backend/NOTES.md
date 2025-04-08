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
- `npx prisma generate` to generate a new prisma client

## Notes

- When testing locally, an `.env` file is required with the DATABASE_URL key, in the project root directory `.`

## TODOs

- Test edge cases
- Add match creation logic in tournaments
- Add more tests
- Update database with Characters enum for TournamentParticipant and Match