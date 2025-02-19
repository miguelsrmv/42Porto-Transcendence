FROM nginx:latest

COPY ./src/index_placeholder.html /var/www/ft_transcendence/index.html

COPY ./conf/nginx_template.conf /etc/nginx/conf.d/nginx_template.conf

COPY ./conf/nginx_setup.sh /

RUN chmod +x /nginx_setup.sh

EXPOSE 443

ENTRYPOINT ["./nginx_setup.sh"]
