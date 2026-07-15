#!/bin/bash

cd "$(dirname "$0")" || exit 1

echo "Stopping services..."

read -p "Remove named volumes declared in the compose file? [y/N] " -n 1 -r
echo

if [[ $REPLY =~ ^[Yy]$ ]]; then
  echo "Removing volumes..."
  docker compose down -v
  echo "Volumes removed."
else
  docker compose down
  echo "Volumes preserved."
fi
