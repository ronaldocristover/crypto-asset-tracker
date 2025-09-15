#!/bin/bash

# DigitalOcean Deployment Script for Asset Tracker
# This script pulls the latest images and deploys them to your DigitalOcean Droplet

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}Starting Asset Tracker deployment...${NC}"

# Check if required environment variables are set
if [ -z "$DIGITALOCEAN_REGISTRY_NAME" ]; then
    echo -e "${RED}Error: DIGITALOCEAN_REGISTRY_NAME environment variable is not set${NC}"
    exit 1
fi

if [ -z "$DATABASE_URL" ]; then
    echo -e "${RED}Error: DATABASE_URL environment variable is not set${NC}"
    exit 1
fi

# Login to DigitalOcean Container Registry
echo -e "${YELLOW}Logging in to DigitalOcean Container Registry...${NC}"
echo "$DIGITALOCEAN_ACCESS_TOKEN" | docker login registry.digitalocean.com -u "$DIGITALOCEAN_ACCESS_TOKEN" --password-stdin

# Pull latest images
echo -e "${YELLOW}Pulling latest images...${NC}"
docker pull registry.digitalocean.com/$DIGITALOCEAN_REGISTRY_NAME/asset-tracker-backend:latest
docker pull registry.digitalocean.com/$DIGITALOCEAN_REGISTRY_NAME/asset-tracker-frontend:latest

# Stop existing containers
echo -e "${YELLOW}Stopping existing containers...${NC}"
docker-compose -f docker-compose.prod.yml down

# Start new containers
echo -e "${YELLOW}Starting new containers...${NC}"
docker-compose -f docker-compose.prod.yml up -d

# Wait for services to be ready
echo -e "${YELLOW}Waiting for services to be ready...${NC}"
sleep 10

# Check if services are running
echo -e "${YELLOW}Checking service status...${NC}"
docker-compose -f docker-compose.prod.yml ps

# Test backend health
echo -e "${YELLOW}Testing backend health...${NC}"
if curl -f http://localhost:3001/api/health > /dev/null 2>&1; then
    echo -e "${GREEN}Backend is healthy!${NC}"
else
    echo -e "${RED}Backend health check failed${NC}"
fi

# Test frontend
echo -e "${YELLOW}Testing frontend...${NC}"
if curl -f http://localhost > /dev/null 2>&1; then
    echo -e "${GREEN}Frontend is accessible!${NC}"
else
    echo -e "${RED}Frontend is not accessible${NC}"
fi

echo -e "${GREEN}Deployment completed!${NC}"
echo -e "${GREEN}Your application is now running at:${NC}"
echo -e "  Frontend: http://$(curl -s ifconfig.me)"
echo -e "  Backend API: http://$(curl -s ifconfig.me):3001"
