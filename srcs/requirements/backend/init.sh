#!/bin/bash

npx prisma migrate dev
npm run build
chmod -R 755 ./dist
exec npm start