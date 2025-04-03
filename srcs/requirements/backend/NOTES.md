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
|   |── utils/                      # Utility functions/helpers
|   |   |── hash.ts                 # Password hashing
|   |   |── prisma.ts               # Prisma client setup
|   |── app.ts                      # Main Fastify instance setup
|   |── fastify.d.ts                # Declaration file to provide typescript type information about the Fastify app
|
|── tests/
|   |── requests.http               # API calls test file
|
|── .dockerignore
|── .gitignore
|── Dockerfile
|── init.sh                         # Entrypoint script for the Docker container
|── NOTES.md
|── package.json                    # Project configurations
|── tsconfig.json                   # TypeScript config
```

# Useful commands

- `npx tsx <script.ts>` to execute a TS script
- `npx prisma migrate dev --name <migration_name>` to migrate changes to the database (it also generates a prisma client)
- `npx prisma generate` to generate a new prisma client

## Notes

- When testing locally, an `.env` file is required with the DATABASE_URL key, in the project root directory `.`

## TODOs
- Update API documentation
- Test newly created routes (match and tournament related)
- Add more tests
