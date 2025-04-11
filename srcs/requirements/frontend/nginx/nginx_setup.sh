#!/bin/sh

# Get environment variables updated on the nginx_config file
envsubst '$DOMAIN_NAME' < /etc/nginx/conf.d/nginx_template.conf > /etc/nginx/conf.d/default.conf

# Check if certificate already exists
if [ ! -f /etc/ssl/nginx-selfsigned.pem ]; then
    echo "Generating self-signed SSL certificate..."
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
        -out /etc/ssl/nginx-selfsigned.pem \
        -keyout /etc/ssl/nginx-selfsigned.key \
        -subj "/C=PT/ST=Porto/L=Porto/O=42/OU=42/CN=${DOMAIN_NAME}/UID=${USER}"
else
    echo "SSL certificate already exists, skipping generation."
fi

#TODO: We can remove the following 3 instructions, they are just here for hot reloading
# Start Nginx in the background
nginx &

# Install inotify-tools (only needed in Alpine-based Nginx)
apk add --no-cache inotify-tools

# Watch the HTML file for changes and reload Nginx
while inotifywait -e modify /var/www/ft_transcendence/static/index.html; do
    echo "Detected change in index.html, reloading Nginx..."
    nginx -s reload
done

# Starts nginx
exec nginx -g 'daemon off;'
