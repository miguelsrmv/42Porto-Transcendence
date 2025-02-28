FROM nginx:latest

#TODO: Uncomment after web files are done
#TODO: Currently this dir is being mounted on the volume
#COPY ./public/index.html /var/www/ft_transcendence/index.html
#TODO: Make it so that all the /public file is copied to /ft_transcendence

COPY ./conf/nginx_template.conf /etc/nginx/conf.d/nginx_template.conf

COPY ./conf/nginx_setup.sh /

RUN chmod +x /nginx_setup.sh

EXPOSE 443

ENTRYPOINT ["./nginx_setup.sh"]
