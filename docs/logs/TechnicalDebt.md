# Technical Debt Log for ft_transcendence

## 1. Hard-coded variables in the server container

### Date Created: 15/02/2025
### Branch: "Frontend"

#### Issue:
1. **Dockerfile**: Contains hard-coded domain name (`padaria.42.pt`).
2. **conf/nginx_template.conf**: Domain name is hard-coded in the Nginx configuration file.
3. **conf/nginx_setup.sh**: A commented-out variable intended for future use but still hardcoded.

#### Reason:
- The project is not yet built with Docker Compose, so environment variables cannot be accessed from a `.env` file.

#### Impact:
- **Scalability**: The hard-coded variables make it difficult to change the domain or environment settings across multiple environments without editing files directly.
- **Maintainability**: Future configuration changes require manual updates to the `Dockerfile`, Nginx config, and setup script.
- **Portability**: The project is tied to specific hard-coded values, preventing seamless deployment across different environments or machines.

#### Priority: Low

#### Next Steps:
1. Implement Docker Compose to manage environment variables via `.env` files.
2. Replace hard-coded variables in `Dockerfile`, `conf/nginx_template.conf`, and `conf/nginx_setup.sh` with environment variables from `.env`.


## 2. Lack of DNS Resolution

### Date Created: 15/02/2025
### Branch: "Frontend"

#### Issue:
1. **Makefile**: Does not guarantee our DOMAIN_NAME is part of `/etc/hosts`

#### Reason:
- No time for implementation yet

#### Impact
- **Maintainability**: It will demand manual edit of `/etc/hosts` whenever we try the project on a new machine

#### Priority: Low

#### Next Steps:
1. Add the required domain to the `/etc/hosts` file through the Makefile, probably whenever we have Docker Compose setup
