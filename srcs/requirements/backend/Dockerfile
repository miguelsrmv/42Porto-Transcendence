FROM node:23.11-slim

# Required by latest Prisma version
RUN apt-get update -y && apt-get install -y openssl

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY src/ ./src
COPY scripts/ ./scripts
COPY prisma/ ./prisma
COPY init.sh ./
COPY tsconfig.json ./

RUN chmod 755 ./init.sh

EXPOSE 3000

ENTRYPOINT ["./init.sh"]
