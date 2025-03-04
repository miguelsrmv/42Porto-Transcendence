FROM node:slim

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN ["npm", "run", "build"]

RUN ["chmod", "-R", "755", "./dist"]

EXPOSE 3000

CMD ["npm", "start"]
