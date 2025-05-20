# Centralized Firewall Management System

This system consists of a MongoDB backend server and a Python Flask endpoint client that communicate with each other to manage firewall rules, monitor traffic, and detect anomalies.

## Components

1. **MongoDB Backend**: Node.js server that provides the central management system
2. **Endpoint Client**: Python Flask application that simulates an endpoint device

## Prerequisites

- Node.js (v14+)
- Python 3.7+
- MongoDB Atlas account (connection string is already configured)

## Setup and Running

### Option 1: Using the Simple Start Script

This script will start both the MongoDB backend and endpoint client:

```bash
./start-system-simple.sh
```

### Option 2: Manual Setup

#### 1. Start the MongoDB Backend

```bash
cd mongodb-backend
npm install
node src/scripts/create-admin-user.js  # Create admin user
npm start
```

#### 2. Start the Endpoint Client

```bash
cd endpoint-client
./run.sh
```

## Accessing the Applications

- **Endpoint Client**: http://localhost:5000
- **MongoDB Backend**: http://localhost:3000

## Authentication

The system uses JWT authentication. The default admin credentials are:

- **Username**: admin
- **Password**: admin123

## Features

### MongoDB Backend

- User authentication and authorization
- Endpoint management
- Application management
- Firewall rule management
- Traffic log collection and analysis
- Anomaly detection and reporting
- Real-time communication via WebSockets

### Endpoint Client

- Authentication with the central server
- Fetching and storing firewall rules locally
- Simulated traffic monitoring
- Dummy anomaly detection
- Sending logs to the central server
- WebSocket communication for real-time updates
- Web interface for testing and demonstration

## Troubleshooting

### Connection Issues

If the endpoint client cannot connect to the MongoDB backend:

1. Ensure the MongoDB backend is running
2. Check the MongoDB connection string in both applications
3. Verify that the admin user has been created
4. Check the logs for specific error messages

### Authentication Issues

If authentication fails:

1. Ensure the admin user has been created using the provided script
2. Check that the JWT secret is the same in both applications
3. Verify that the token is being correctly passed in the Authorization header

## Architecture

The system uses a client-server architecture:

- The MongoDB backend provides the central management system and API
- The endpoint client communicates with the backend to get rules and send logs
- Both components use the same MongoDB database for storage
- WebSockets provide real-time communication between the components

## MongoDB Connection

Both components use the same MongoDB connection string:
```
mongodb+srv://roadsidecoder:yCeoaaLmLmYgxpK1@cluster0.yhpeljt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
```

This connects to a MongoDB Atlas cluster that is already configured for this application.
