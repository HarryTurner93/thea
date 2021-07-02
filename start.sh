#!/bin/bash

# If docker-compose is not installed, then install it.
if ! command -v docker-compose &>/dev/null; then
    sudo apt-get update
    sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
fi

# If docker is not installed, then install it.
if ! command -v docker &>/dev/null; then
    sudo apt-get update
    sudo apt-get install apt-transport-https ca-certificates curl gnupg lsb-release
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
    echo  "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
    sudo apt-get install docker-ce docker-ce-cli containerd.io
    sudo systemctl enable --now docker
    usermod -aG docker $USER
    exec su -l $USER
fi

# Make the directory for the database.
[ ! -d "./db" ] && mkdir db

docker-compose up