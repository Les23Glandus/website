#!/bin/bash
cd "$(dirname "$0")"

git reset --hard
git pull
sudo chmod +x ./update.sh

docker compose build
docker compose up -d