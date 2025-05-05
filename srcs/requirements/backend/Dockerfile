FROM node:23.11-slim

# Required by latest Prisma version
RUN apt-get update -y && apt-get install -y openssl

WORKDIR /app

COPY package*.json ./

RUN npm install speakeasy qrcode jsonwebtoken

COPY . .

RUN chmod 755 ./init.sh

EXPOSE 3000

ENTRYPOINT ["./init.sh"]
