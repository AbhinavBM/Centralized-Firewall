#!/bin/bash

# Colors for better output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}Building and serving Centralized Firewall Frontend...${NC}"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}Node.js is not installed. Please install Node.js (v16 or higher) and try again.${NC}"
    exit 1
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Installing dependencies...${NC}"
    npm install
fi

# Build the application
echo -e "${YELLOW}Building the application...${NC}"
npm run build

# Check if serve is installed
if ! command -v serve &> /dev/null; then
    echo -e "${YELLOW}Installing serve...${NC}"
    npm install -g serve
fi

# Serve the application
echo -e "${GREEN}Starting the server...${NC}"
echo -e "${GREEN}The application is now available at http://localhost:5000${NC}"
serve -s build
