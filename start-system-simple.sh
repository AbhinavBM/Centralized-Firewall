#!/bin/bash

# Script to start both the MongoDB backend and endpoint client
# This version doesn't require MongoDB to be running separately

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}Starting Centralized Firewall Management System${NC}"

# Create admin user in MongoDB backend
echo -e "${YELLOW}Creating admin user in MongoDB backend...${NC}"
cd mongodb-backend
node src/scripts/create-admin-user.js
cd ..

# Start MongoDB backend in the background
echo -e "${YELLOW}Starting MongoDB backend...${NC}"
cd mongodb-backend
npm start &
BACKEND_PID=$!
cd ..

# Wait for backend to start
echo -e "${YELLOW}Waiting for backend to start...${NC}"
sleep 10

# Start endpoint client
echo -e "${YELLOW}Starting endpoint client...${NC}"
cd endpoint-client
./run.sh &
ENDPOINT_PID=$!
cd ..

# Function to handle script termination
function cleanup {
  echo -e "${YELLOW}Stopping services...${NC}"
  kill $BACKEND_PID
  kill $ENDPOINT_PID
  echo -e "${GREEN}Services stopped.${NC}"
  exit 0
}

# Register the cleanup function for when the script is terminated
trap cleanup SIGINT SIGTERM

echo -e "${GREEN}Both services are running. Press Ctrl+C to stop.${NC}"
echo -e "${YELLOW}MongoDB backend is running with PID: $BACKEND_PID${NC}"
echo -e "${YELLOW}Endpoint client is running with PID: $ENDPOINT_PID${NC}"
echo -e "${YELLOW}Access the endpoint client at: http://localhost:5000${NC}"
echo -e "${YELLOW}Access the MongoDB backend at: http://localhost:3000${NC}"

# Keep the script running
while true; do
  sleep 1
done
