#!/bin/bash
cd "$(dirname "$0")"

git reset --hard
git pull
npm install
NODE_OPTIONS="--max-old-space-size=4096" npm run build
sudo chmod +x ./update.sh