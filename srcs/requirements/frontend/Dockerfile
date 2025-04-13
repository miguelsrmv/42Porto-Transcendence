# ----------------------------------
# First image: Compiles Typescript to Javascript and Tailwind to CSS
# ----------------------------------

FROM node:18 as builder

# Install TypeScript globally
RUN npm install -g typescript tailwindcss @tailwindcss/cli

# Set working directory
WORKDIR /app

# Copy TypeScript and Tailwind files, and their configs
RUN mkdir -p src
COPY ./src ./src
COPY ./tsconfig.json ./
COPY ./tailwind.config.js ./
COPY ./package.json ./
COPY ./package-lock.json ./

# Installs dependencies
RUN npm install

# Compile TypeScript files 
RUN npm run build-ts

# Compile Tailwind files
RUN npm run build-tailwind

# ----------------------------------
# Final image: Only includes compiled javascript + nginx
# ----------------------------------
FROM nginx:latest

COPY --from=builder /app /var/www/ft_transcendence
#TODO: Once project is finalized, change to only copy from /app/dist?
#NOTE: AS LONG AS WE'RE ON HOT RELOADING, THE FIRST CONTAINER IS "WRONG" BECAUSE "dist/" WILL BE OVERWRITTEN BY OUR EMPTY DIST
#FIX: Run "npm run build" or both --watch commands while on dev environment

COPY ./nginx/nginx_template.conf /etc/nginx/conf.d/nginx_template.conf

COPY ./nginx/frontend_setup.sh /

RUN chmod +x /frontend_setup.sh

EXPOSE 443

ENTRYPOINT ["./frontend_setup.sh"]
