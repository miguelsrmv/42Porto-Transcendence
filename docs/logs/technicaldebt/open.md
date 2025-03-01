# Open Technical Debt Log for ft_transcendence

## 1. Node_modules volume in backend container
### Date Created: 19/02/2025
### Branch: "Docker Infrastructure"
### Context: 🔍 Why Is `node_modules` in `docker-compose.yml`?
#### When developing with Docker, we often **mount the local backend directory** inside the container: "volumes: - ./requirements/backend:/app
#### This replaces /app inside the container with your local files. However, this causes a problem: Dependencies Get Overwritten! Inside the container, npm install places dependencies in /app/node_modules. But since /app is replaced by ./requirements/backend, the node_modules directory disappears! This breaks the application because dependencies are missing.
#### As such, we used a named volume 'node_modules:/app/node_modules' (a persistent volume for dependencies) which will be removed in production!
