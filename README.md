# 42Porto-Transcendence
This project is about doing something you’ve never done before. Remind yourself of the beginning of your journey in computer science. Look at you now. Time to shine!

Notes on [Notion](https://www.notion.so/ft_transcendence-12ddde8bdb0f802f8d95cda450775933).
Mockup on [Google Drive](https://docs.google.com/presentation/d/16AGtsTiVEO5TQ0uBFkrn_o4qH4HXTTW8y0fL1zaiMaM/edit?usp=sharing).

# Repository Structure

## Root Directory

- `Makefile`: Contains build automation rules and commands for the project
- `en.subject.pdf`: Project requirements and specifications document
- `srcs/`: Source code and infrastructure configurations
- `assets/`: Static resources, media files, and other project assets
- `docs/`: Comprehensive project documentation

## Documentation Structure (`docs/`)

### API Documentation (`docs/api/`)
- API specifications
- Endpoint documentation
- Request/response examples
- Authentication details

### Architecture (`docs/architecture/`)
- System design documents
- Infrastructure diagrams

### Contributing Guidelines (`docs/contributing/`)
- Development workflow
- Code style guides
- Pull request procedures
- Best practices

### Documentation Assets (`docs/images/`)
- Images used in documentation
- Diagrams
- Screenshots

### Logs (`docs/logs/`)
- Team meeting minutes
- Decision records
- Issue tracking logs
- Important discussions and decisions

### Scripts (`docs/scripts/`)
- Scripts for testing

## Source Code Structure (`srcs/`)

### Requirements (`srcs/requirements/`)
Contains Dockerfiles and configurations for different services

#### Backend (`backend/`)
- Backend service Dockerfile
- Application server configuration

#### Blockchain (`blockchain/`)
- Blockchain service Dockerfile
- Blockchain node configuration

#### Database (`database/`)
- Database service Dockerfile
- Database initialization scripts

#### Server (`server/`)
- Web server Dockerfile
- Server configuration files

#### Root Level (`srcs/requirements/`)
- `docker-compose.yml`: Defines and configures all services
