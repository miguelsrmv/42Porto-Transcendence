#!/bin/sh

envsubst '$DOMAIN_NAME' < /etc/nginx/conf.d/nginx_template.conf > /etc/nginx/conf.d/default.conf
exec nginx -g 'daemon off;'
