#!/bin/bash

npx prisma migrate dev                    # Apply migrations to the database and generate prisma client
npm run build                             # Generate the .js files in dist/
chmod -R 755 ./dist                       # Give execution permission to dist/
node ./dist/scripts/generateUsers         # Generate users
exec npm start                            # Execute dist/app.js