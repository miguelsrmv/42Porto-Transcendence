#!/bin/bash

export PRIVATE_KEY=$(cat /run/secrets/private_key)  # Create env variable from docker-compose secrets
npx prisma migrate dev                              # Apply migrations to the database, generate prisma client and run seed script
npm run build                                       # Generate the .js files in dist/
chmod -R 755 ./dist                                 # Give execution permission to dist/
exec npm run start-dev                              # Execute dist/app.js