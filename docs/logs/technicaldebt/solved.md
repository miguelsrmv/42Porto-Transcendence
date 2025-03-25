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
