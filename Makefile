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
DB_DATA = $(PWD)/data/backend_db
BC_DATA = $(PWD)/data/blockchain
COMPOSE = docker compose -f ./srcs/docker-compose.yml

all: up

up: dependencies
	@mkdir -p $(DB_DATA)
	@mkdir -p $(BC_DATA)
	@sudo hostsed add 127.0.0.1 $(DOMAIN_NAME)
	@$(COMPOSE) up --build -d

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
	@docker system prune -a

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


bc:
	@$(COMPOSE) build blockchain

server_clean:
	$(COMPOSE) rm -sf server
	@docker rmi -f server || true

backend_clean:
	$(COMPOSE) rm -sf backend
	@docker rmi -f backend || true

bc_clean:
	$(COMPOSE) rm -sf blockchain
	@docker rmi -f blockchain || true

dependencies:
	@which docker > /dev/null 2>&1 || (echo "Docker not found. Installing..." && sudo apt-get update && sudo apt-get install -y docker.io)
	@which hostsed > /dev/null 2>&1 || (echo "Hostsed not found. Installing..." && sudo apt-get update && sudo apt-get install -y hostsed)

test: 
	@./docs/scripts/build_dockerfile_test.sh  #Tests build

.PHONY: all up down build clean re prune status server backend bc server_clean backend_clean bc_clean depedencies test 
