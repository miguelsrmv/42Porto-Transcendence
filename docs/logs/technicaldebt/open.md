# Open Technical Debt Log for ft_transcendence

## 1. Node_modules volume in backend container
### Date Created: 19/02/2025
### Branch: "Docker Infrastructure"
### Context: 🔍 Why Is `node_modules` in `docker-compose.yml`?
#### When developing with Docker, we often **mount the local backend directory** inside the container: "volumes: - ./requirements/backend:/app
#### This replaces /app inside the container with your local files. However, this causes a problem: Dependencies Get Overwritten! Inside the container, npm install places dependencies in /app/node_modules. But since /app is replaced by ./requirements/backend, the node_modules directory disappears! This breaks the application because dependencies are missing.
#### As such, we used a named volume 'node_modules:/app/node_modules' (a persistent volume for dependencies) which will be removed in production!

## 2. Server volume in server container
### Date Created: 28/02/2025
### Branch: "Frontend"
### Context: Files are not being copied due to hot reloading of containers
#### For development, it is easier for containers to "hot reload" rather than being made over and over and having files copied. As such, instead of copying files, /public is being mounted in /var/www/ft_transcendence. This has to be changed on server/Dockerfile and docker-compose.yml prior to delivering the project

## 3. Typescript compiling not in server container
### Date Created: 01/03/2025
### Branch: "Frontend"
### Context: We are supposed to delived Typescript files
#### For development, it is easier to compile .ts files locally and have the .js files automatically sync with the frontend container. Once frontend development is finished, our server container should be able to compile the .ts file and create the .js files the website will be using.

## 4. make clean deletes volumes on Docker, but not the files themselves
### Date Created: 11/03/2025
### Branch: "Backend"
### Context: There should be a rule that completely "zeroes" the app's state
#### Adding a sudo rm -rf DB_DATA to the Makefile clean rule would solve this
