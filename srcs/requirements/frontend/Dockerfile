FROM nginx:latest

#TODO: Currently /public is being mounted directly as /ft_transcendence. In production, make it so that all the /public files are copied to /ft_transcendence.
#TODO: After files are copied, intall typescript and have it compile the .ts file to .js?

COPY ./nginx/nginx_template.conf /etc/nginx/conf.d/nginx_template.conf

COPY ./nginx/nginx_setup.sh /

RUN chmod +x /nginx_setup.sh

EXPOSE 443

ENTRYPOINT ["./nginx_setup.sh"]
