#!/bin/bash

cd "$(dirname "$0")"

echo "Stopping services..."
docker compose down

echo ""
read -p "Remove named volumes declared in the compose file? [y/N] " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  echo "Removing volumes..."
  docker compose down -v
  echo "Volumes removed."
else
  echo "Volumes preserved."
fi
