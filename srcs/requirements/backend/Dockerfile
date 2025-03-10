FROM node:20-slim

RUN apt-get update -y && apt-get install -y openssl

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN ["chmod", "755", "./init.sh"]

EXPOSE 3000

ENTRYPOINT ["./init.sh"]