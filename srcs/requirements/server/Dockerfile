FROM nginx:latest

#TODO:Remove after project is buildable with Docker Compose. Variable is on .env
ARG DOMAIN_NAME=padaria.42.pt

COPY ./src/index_placeholder.html /var/www/ft_transcendence/index.html

COPY ./conf/nginx_template.conf /etc/nginx/conf.d/nginx_template.conf

COPY ./conf/nginx_setup.sh /

RUN chmod +x /nginx_setup.sh

EXPOSE 443

ENTRYPOINT ["./nginx_setup.sh"]
