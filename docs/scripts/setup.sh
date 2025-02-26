#!/bin/bash

set -e  # Exit on any error

DOMAIN_NAME="padaria.42.pt"

# Detect the OS
if [[ -f /etc/debian_version ]]; then
    OS="debian"
elif [[ -f /etc/arch-release ]]; then
    OS="arch"
else
    echo "Unsupported OS. This script only works on Debian-based or Arch Linux systems."
    exit 1
fi

# Step 1: Add Domain to /etc/hosts
if ! grep -q "$DOMAIN_NAME" /etc/hosts; then
    echo "127.0.0.1    $DOMAIN_NAME" | sudo tee -a /etc/hosts > /dev/null
    echo "Added $DOMAIN_NAME to /etc/hosts"
else
    echo "$DOMAIN_NAME is already in /etc/hosts"
fi

# Step 2: Install Docker
echo "Installing Docker for $OS..."
if [[ "$OS" == "debian" ]]; then
    sudo apt update && sudo apt install -y docker.io
elif [[ "$OS" == "arch" ]]; then
    sudo pacman -Syu --noconfirm
    sudo pacman -S --noconfirm docker
fi

# Step 3: Start and Enable Docker
sudo systemctl start docker
sudo systemctl enable docker

# Step 4: Allow Non-Root Users to Use Docker
if ! groups $USER | grep -q docker; then
    sudo groupadd docker || true
    sudo usermod -aG docker $USER
    echo "Added $USER to the docker group. Log out and log back in for changes to take effect."
fi

echo "Setup complete! You can now use Docker and access $DOMAIN_NAME locally."
