# ----------------------------------
# First image: Compiles Typescript to Javascript and Tailwind to CSS
# ----------------------------------

FROM node:18 as builder

# Install TypeScript globally
RUN npm install -g typescript tailwindcss @tailwindcss/cli

# Set working directory
WORKDIR /app

# Copy TypeScript and Tailwind files, and their configs
COPY ./src ./src
COPY ./tsconfig.json ./
COPY ./tailwind.config.js ./
COPY ./package.json ./
COPY ./package-lock.json ./

# Installs dependencies
RUN npm install

# Compile TypeScript files to JavaScript
RUN tsc

# Build Tailwind CSS 
RUN npx tailwindcss -i ./src/tailwind.css -o ./dist/output.css

# ----------------------------------
# Final image: Only includes compiled javascript + nginx
# ----------------------------------
FROM nginx:latest

COPY --from=builder /app /var/www/ft_transcendence

COPY ./nginx/nginx_template.conf /etc/nginx/conf.d/nginx_template.conf

COPY ./nginx/frontend_setup.sh /

RUN chmod +x /frontend_setup.sh

EXPOSE 443

ENTRYPOINT ["./frontend_setup.sh"]
