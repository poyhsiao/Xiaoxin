#!/bin/bash
set -e

cd "$(dirname "$0")"

echo "Starting PostgreSQL, Valkey, and Logto services..."

docker compose up -d postgres valkey logto

echo ""
echo "Waiting for services to be ready..."
sleep 5

# Wait for each service to be healthy
for service in postgres valkey logto; do
  for i in {1..30}; do
    status=$(docker compose ps --format json 2>/dev/null | grep -o "\"Service\":\"$service\",\"State\":\"[^\"]*\"" | grep -o '"State":"[^"]*"' | cut -d'"' -f4)
    health=$(docker compose ps --format json 2>/dev/null | grep -o "\"Service\":\"$service\",\"Health\":\"[^\"]*\"" | grep -o '"Health":"[^"]*"' | cut -d'"' -f4)

    if [[ "$status" == "running" ]] && [[ "$health" == "healthy" || "$health" == "" ]]; then
      echo "  $service is ready"
      break
    fi
    if [[ $i -eq 30 ]]; then
      echo "  WARNING: $service may not be fully ready yet"
    fi
    sleep 2
  done
done

echo ""
docker compose ps

echo ""
echo "Connection info:"
echo "  PostgreSQL: localhost:5432 (user: ${POSTGRES_USER:-xiaoxin}, db: ${POSTGRES_DB:-xiaoxin})"
echo "  Valkey:    localhost:6379"
echo "  Logto:     http://localhost:3001"
