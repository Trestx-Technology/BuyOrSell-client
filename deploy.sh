#!/bin/bash

# Docker Deployment script for BuyOrSell Client
# Usage: ./deploy.sh [tag]

set -e

TAG=${1:-latest}
IMAGE_NAME="buyorsell-client"
CONTAINER_NAME="buyorsell-client"

echo "🚀 Starting Docker deployment for $IMAGE_NAME:$TAG..."

# Pull latest image if using a registry
# docker pull your-registry/$IMAGE_NAME:$TAG

# Stop and remove existing container
echo "⏹️  Stopping existing container..."
docker stop $CONTAINER_NAME || true
docker rm $CONTAINER_NAME || true

# Run new container
echo "▶️  Starting new container..."
docker run -d \
    --name $CONTAINER_NAME \
    --restart always \
    -p 3000:3000 \
    --env-file .env \
    $IMAGE_NAME:$TAG

echo "✅ Deployment completed successfully!"
docker ps | grep $CONTAINER_NAME
