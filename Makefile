# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Makefile                                           :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: mde-sa-- <mde-sa--@student.42porto.com>    +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2025/02/03 14:09:04 by mde-sa--          #+#    #+#              #
#    Updated: 2025/02/03 14:09:14 by mde-sa--         ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

DOMAIN_NAME = padaria.42.pt
DB_DATA = $(PWD)/data/database
BC_DATA = $(PWD)/data/blockchain

all: up

up:
	mkdir -p $(DB_DATA)
	mkdir -p $(BC_DATA)
	@sudo hostsed add 127.0.0.1 $(DOMAIN_NAME)
	@docker compose -f ./srcs/docker-compose.yml up --build -d

down:
	@docker compose -f ./srcs/docker-compose.yml down

build:
	@docker compose -f ./srcs/docker-compose.yml build

clean: down
	@echo "** REMOVING IMAGES **"
	@docker rmi -f $$(docker images -qa)
	@echo "** REMOVING VOLUMES **"
	@docker volume rm $$(docker volume ls -q)
	@echo "** REMOVING DOMAIN NAME **"
	@sudo hostsed rm 127.0.0.1 $(DOMAIN_NAME)

re: clean up

prune:
	docker system prune -a

status:
	@clear
	@docker ps -a
	@echo ""
	@docker image ls
	@echo ""
	@docker volume ls
	@echo ""
	@docker network ls
	@echo ""

.PHONY: all up down build clean re phony prune
