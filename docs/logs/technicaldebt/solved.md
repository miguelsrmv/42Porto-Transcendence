# Solved Technical Debt issues for ft_transcendence

## 1. Hard-coded variables in the server container

### Date Created: 15/02/2025
### Branch: "Frontend"
### Solution: implemented Docker Compose build rules so .env could be used

## 2. Lack of DNS Resolution

### Date Created: 15/02/2025
### Branch: "Frontend"
### Solution: implemented makefile rule with hostsed

## 4. Database permanence between make clean

### Date Created: 11/03/2025
### Branch: "Backend"
### Solution: added sudo rm -rf DATA to makefile clean rule

## 5. Typescript compiling not in server container
### Date Created: 01/03/2025
### Branch: "Frontend"
### Solution: Divided Frontend into one transient container (that compiles typescript & tailwind) and then copies these files to the nginx container.

## 6. Server volume in server container
### Date Created: 28/02/2025
### Branch: "Frontend"
### Solution: Same as #5

