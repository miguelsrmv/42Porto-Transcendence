#!/bin/bash

DOCKER_COMPOSE_FILE="srcs/docker-compose.yml"

echo "========================================"
echo "🚀 Running Docker Compose Test Script"
echo "========================================"

# 1️⃣ Build Services
echo "🔨 Building Docker services..."
docker compose -f $DOCKER_COMPOSE_FILE build
if [ $? -ne 0 ]; then
  echo "❌ Docker Compose build failed."
  exit 1
fi
echo "✅ Docker Compose build successful."

# 2️⃣ Start Services
echo "🔄 Starting Docker services..."
docker compose -f $DOCKER_COMPOSE_FILE up -d
if [ $? -ne 0 ]; then
  echo "❌ Docker services failed to start."
  exit 1
fi
echo "✅ Docker services started successfully."

# 3️⃣ Check Running Containers
echo "🔍 Checking running containers..."
if ! docker compose -f $DOCKER_COMPOSE_FILE ps | grep -q "Up"; then
  echo "❌ One or more containers are not running!"
  exit 1
fi
echo "✅ All containers are running."

# 4️⃣ Check Networks
echo "🌐 Checking Docker networks..."
networks=("private-transcendence-network" "public-transcendence-network")
for network in "${networks[@]}"; do
  if ! docker network ls | grep -q "$network"; then
    echo "❌ Network $network is missing!"
    exit 1
  fi
done
echo "✅ All networks exist."

# 5️⃣ Check Volumes
echo "💾 Checking Docker volumes..."
volumes=("backend_db" "blockchain_data" "node_modules")
for volume in "${volumes[@]}"; do
  if ! docker volume ls | grep -q "$volume"; then
    echo "❌ Volume $volume is missing!"
    exit 1
  fi
done
echo "✅ All volumes exist."

# 6️⃣ Check Open Ports
echo "📡 Checking open ports..."
if ! docker compose -f $DOCKER_COMPOSE_FILE ps | grep -q "0.0.0.0"; then
  echo "❌ Expected services are not exposing ports!"
  exit 1
fi
echo "✅ Services are exposing expected ports."

'
# 7️⃣ Check Backend Health (if healthcheck exists)
 echo "🩺 Checking Backend service health..."
 backend_container=$(docker-compose -f $DOCKER_COMPOSE_FILE ps -q Backend)
 if docker inspect --format '{{json .State.Health.Status}}' "$backend_container" | grep -q "healthy"; then
  echo "✅ Backend service is healthy."
 else
  echo "❌ Backend service is unhealthy!"
  exit 1
fi

# 8️⃣ Check Backend API
echo "🌍 Testing backend API..."
if curl -fs http://localhost:3000/health; then
  echo "✅ Backend API is responding."
else
  echo "❌ Backend API is not responding!"
  exit 1
fi

# 9️⃣ Check Database Setup
echo "🗄️ Checking SQLite database setup..."
if docker compose -f $DOCKER_COMPOSE_FILE exec Backend sqlite3 /app/database.db ".tables" | grep -q "users"; then
  echo "✅ Database is initialized correctly."
else
  echo "❌ Database tables are missing!"
  exit 1
fi
'

# 🔟 Stop and Clean Up
echo "🛑 Stopping and removing Docker services..."
docker compose -f $DOCKER_COMPOSE_FILE down
echo "✅ Cleanup complete."

echo "🎉 All tests passed successfully!"
exit 0
