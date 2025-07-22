# ----------------------------------
# First image: Compiles Typescript to Javascript and Tailwind to CSS
# ----------------------------------

FROM node:23.11-slim AS builder

# Install TypeScript globally
RUN npm install -g typescript tailwindcss @tailwindcss/cli

# Set working directory
WORKDIR /app

# Copy dependency files
COPY ./src ./src
COPY ./static ./static
COPY ./tsconfig.json ./
COPY ./tailwind.config.js ./
COPY ./package*.json ./

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

# Copy files from builder to the new compiler
COPY --from=builder /app/dist /var/www/ft_transcendence/dist
COPY --from=builder /app/static /var/www/ft_transcendence/static

# Copy Nginx config
COPY ./nginx/nginx_template.conf /etc/nginx/conf.d/nginx_template.conf

# Setup Frontend
COPY ./nginx/frontend_setup.sh /
RUN chmod +x /frontend_setup.sh

# Port to expose
EXPOSE 443

ENTRYPOINT ["./frontend_setup.sh"]
