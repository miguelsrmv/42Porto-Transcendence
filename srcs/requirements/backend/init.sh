#!/bin/bash

npx prisma migrate deploy                       # Apply migrations to the database
npx prisma generate								# Generate prisma client
npm run build                                   # Transpile the .ts files into .js files in dist/
chmod -R 755 ./dist                             # Give execution permission to dist/
exec npm run start                              # Execute dist/server.js