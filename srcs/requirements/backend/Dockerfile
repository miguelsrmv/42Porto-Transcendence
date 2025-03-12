FROM node:23.9-slim

# Required by latest Prisma version
RUN apt-get update -y && apt-get install -y openssl

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN chmod 755 ./init.sh

EXPOSE 3000

ENTRYPOINT ["./init.sh"]