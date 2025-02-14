FROM nginx:latest

# Set environment variables (default values can be overridden at build time)
ARG DOMAIN_NAME=localhost
ARG USER=nginx

COPY ./www/index.html /usr/share/nginx/html/index.html

COPY ./conf/nginx.conf /etc/nginx/conf.d/default.conf

COPY ./scripts/ssl_setup.sh /ssl_setup.sh
RUN chmod +x /ssl_setup.sh

EXPOSE 443

CMD ["/bin/sh", "-c", "/ssl_setup.sh && nginx -g 'daemon off;'"]
