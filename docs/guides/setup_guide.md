# Setting Up a Local Domain and Installing Docker on Linux (Debian & Arch)

## Step 1: Set Up a Local Domain Name

### 1.1 Choose Your Domain Name
Pick a domain name for local development, such as `padaria.42.pt`.

### 1.2 Edit `/etc/hosts`
1. Open the `/etc/hosts` file using a text editor:
   ```sh
   sudo nano /etc/hosts
   ```
2. Add the following line at the bottom:
   ```
   127.0.0.1    padaria.42.pt
   ```
3. Save and exit (in Nano, press `CTRL+X`, then `Y`, then `Enter`).

### 1.3 Verify the Domain
Run the following command to check if the domain resolves correctly:
```sh
ping -c 3 padaria.42.pt
```
If it returns responses from `127.0.0.1`, the setup is correct.

---

## Step 2: Install Docker

### 2.1 Update System Packages
#### On Debian/Ubuntu:
```sh
sudo apt update && sudo apt upgrade -y
```
#### On Arch Linux:
```sh
sudo pacman -Syu
```

### 2.2 Install Docker
#### On Debian/Ubuntu:
```sh
sudo apt install -y docker.io
```
#### On Arch Linux:
```sh
sudo pacman -S docker
```

### 2.3 Start and Enable Docker Service
```sh
sudo systemctl start docker
sudo systemctl enable docker
```

### 2.4 Verify Installation
Check if Docker is running:
```sh
sudo systemctl status docker
```
Run a test container:
```sh
docker run hello-world
```
If you see a message confirming Docker works, the setup is successful.

---

## Step 3: Allow Non-Root Users to Run Docker
To use Docker without `sudo`:
```sh
sudo groupadd docker
sudo usermod -aG docker $USER
newgrp docker
```
Test it by running:
```sh
docker ps
```
If no permission errors appear, the setup is complete!

---

## Done!
You now have a local domain set up and Docker installed on Debian and Arch Linux. 🎉

## Note: Alternatively, run setup.sh from docs/scripts!
