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

DB_DATA = $(PWD)/data/backend_db
BC_DATA = $(PWD)/data/blockchain
COMPOSE = docker compose -f ./srcs/docker-compose.yml

all: up

up:
	@mkdir -p $(DB_DATA)
	@mkdir -p $(BC_DATA)
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

frontend:
	@$(COMPOSE) build frontend

backend:
	@$(COMPOSE) build backend

bc:
	@$(COMPOSE) build blockchain

frontend_clean:
	$(COMPOSE) rm -sf frontend
	@docker rmi -f frontend || true

backend_clean:
	$(COMPOSE) rm -sf backend
	@docker rmi -f backend || true

bc_clean:
	$(COMPOSE) rm -sf blockchain
	@docker rmi -f blockchain || true

test: 
	@./docs/scripts/build_dockerfile_test.sh  #Tests build

.PHONY: all up down build clean re prune status frontend backend bc frontend_clean backend_clean bc_clean test 
