# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Dockerfile                                         :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: mde-sa-- <mde-sa--@student.42porto.com>    +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2025/02/03 14:14:31 by mde-sa--          #+#    #+#              #
#    Updated: 2025/02/03 14:14:59 by mde-sa--         ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

FROM debian:bullseye

RUN apt -y update && apt install -y nginx openssl gettext

RUN mkdir -p /etc/nginx/ssl

EXPOSE 443

COPY ./conf/nginx_template.conf /etc/nginx/conf.d/nginx_template.conf

COPY ./conf/nginx_setup.sh /

RUN chmod +x nginx_setup.sh

ENTRYPOINT ["./nginx_setup.sh"]
