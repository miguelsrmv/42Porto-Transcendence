# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Makefile                                           :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: damachad <damachad@student.42porto.com>    +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2025/02/03 14:09:04 by mde-sa--          #+#    #+#              #
#    Updated: 2025/04/15 17:49:24 by damachad         ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

DB_DATA = $(PWD)/data/backend_db
AVATAR_DATA = $(PWD)/data/avatar
BC_DATA = $(PWD)/data/blockchain
COMPOSE = docker compose -f ./srcs/docker-compose.yml
BLOCKCHAIN_ADDRESS = $(PWD)/srcs/requirements/blockchain/conf/output/blockchain_address.txt

all: up

up:
	@mkdir -p $(DB_DATA)
	@mkdir -p $(BC_DATA)
	@mkdir -p $(AVATAR_DATA)
	@if [ ! -s $(BLOCKCHAIN_ADDRESS) ]; then \
		make contract; \
	fi
	@$(COMPOSE) up --build -d frontend backend

down:
	@$(COMPOSE) down

build:
	@$(COMPOSE) build

clean: down
	@echo "** REMOVING IMAGES **"
	@docker rmi -f $$(docker images -qa) 2>/dev/null || true
	@echo "** REMOVING VOLUMES **"
	@docker volume rm $$(docker volume ls -q) 2>/dev/null || true
	@echo "** DELETING VOLUMES' DATA **"
	@sudo rm -rf $(DB_DATA) $(BC_DATA) $(AVATAR_DATA) data

prune:
	@docker system prune -a

fclean: clean prune clear-blockchain-address

re: clean up

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

contract:
	@echo "** DEPLOYING NEW SMART CONTRACT **"
	@$(COMPOSE) run --build --rm blockchain


clear-blockchain-address:
	@echo "** CLEANING BLOCKCHAIN ADDRESS **"
	@> $(BLOCKCHAIN_ADDRESS)

.PHONY: all up down build clean fclean re prune status contract clear-blockchain-address
