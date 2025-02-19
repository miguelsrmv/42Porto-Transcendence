#!/bin/bash

# Path to your docker compose.yml file
DOCKER_COMPOSE_FILE="./srcs/docker-compose.yml"

# Build the services defined in the docker compose.yml file
echo "Building Docker services..."
docker compose -f $DOCKER_COMPOSE_FILE build

# Check if the build was successful
if [ $? -eq 0 ]; then
  echo "Docker Compose build successful."
else
  echo "Docker Compose build failed."
  exit 1
fi

# Start the services defined in the docker compose.yml file
echo "Starting Docker services..."
docker compose -f $DOCKER_COMPOSE_FILE up -d

# Check if the services started successfully
if [ $? -eq 0 ]; then
  echo "Docker services started successfully."
else
  echo "Docker services failed to start."
  exit 1
fi

# Optionally, check the logs of the service to see if it ran correctly
## Check logs for each service
services=("server" "backend" "blockchain")
for service in "${services[@]}"; do
  echo "Checking logs for $service..."
  docker compose -f $DOCKER_COMPOSE_FILE logs $service
done

# Check if the networks were created
networks=("private-transcendence-network" "public-transcendence-network")
for network in "${networks[@]}"; do
  echo "Checking Docker network $network..."
  docker network ls | grep -E "$network"
  if [ $? -eq 0 ]; then
    echo "Docker network $network was correctly created."
  else
    echo "Docker network $network is missing or not created properly."
    exit 1
  fi
done

# Check if the volumes were created
volumes=("backend_db" "blockchain_data")
for volume in "${volumes[@]}"; do
  echo "Checking Docker volume $volume..."
  docker volume ls | grep -E "$volume"
  if [ $? -eq 0 ]; then
    echo "Docker volume $volume was correctly created."
  else
    echo "Docker volume $volume is missing or not created properly."
    exit 1
  fi
done

# Clean up: Stop and remove the containers
docker compose -f $DOCKER_COMPOSE_FILE down

echo "Docker Compose test script completed."
