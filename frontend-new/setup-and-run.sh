#!/bin/bash

# Colors for better output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}Setting up Centralized Firewall Frontend...${NC}"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}Node.js is not installed. Please install Node.js (v16 or higher) and try again.${NC}"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d 'v' -f 2)
NODE_MAJOR_VERSION=$(echo $NODE_VERSION | cut -d '.' -f 1)

if [ $NODE_MAJOR_VERSION -lt 16 ]; then
    echo -e "${RED}Node.js version $NODE_VERSION is not supported. Please upgrade to v16 or higher.${NC}"
    exit 1
fi

echo -e "${GREEN}Using Node.js version $NODE_VERSION${NC}"

# Install dependencies
echo -e "${YELLOW}Installing dependencies...${NC}"
npm install

# Fix potential dependency issues
echo -e "${YELLOW}Fixing potential dependency issues...${NC}"
npm audit fix --force

# Create .env file for React
echo -e "${YELLOW}Creating environment configuration...${NC}"
cat > .env << EOL
REACT_APP_API_URL=http://localhost:3000/api
REACT_APP_WS_URL=ws://localhost:3000/ws
SKIP_PREFLIGHT_CHECK=true
TSC_COMPILE_ON_ERROR=true
ESLINT_NO_DEV_ERRORS=true
EOL

# Start the application
echo -e "${GREEN}Starting the application...${NC}"
npm start
