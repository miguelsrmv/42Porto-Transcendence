#!/bin/sh

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

exec "$@"
