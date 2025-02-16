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
COMPOSE = docker compose -f ./srcs/docker-compose.yml

all: up

up:
	mkdir -p $(DB_DATA)
	mkdir -p $(BC_DATA)
	@sudo hostsed add 127.0.0.1 $(DOMAIN_NAME)
	@$(COMPOSE) --build -d

down:
	@$(COMPOSE) down

build:
	@$(COMPOSE) build

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

server:
	@$(COMPOSE) build server

backend:
	@$(COMPOSE) build backend

db:
	@$(COMPOSE) build database

bc:
	@$(COMPOSE) build blockchain

server_clean:
	$(COMPOSE) rm -sf server
	docker rmi -f server || true

backend_clean:
	$(COMPOSE) rm -sf backend
	docker rmi -f backend || true

db_clean:
	$(COMPOSE) rm -sf database
	docker rmi -f database || true

bc_clean:
	$(COMPOSE) rm -sf blockchain
	docker rmi -f blockchain || true

.PHONY: all up down build clean re prune status server backend db bc server_clean backend_clean db_clean bc_clean
