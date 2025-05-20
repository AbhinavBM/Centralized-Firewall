# Centralized Firewall MongoDB Backend

This is the MongoDB version of the Centralized Firewall Management System backend. It provides the same API endpoints and functionality as the PostgreSQL version but uses MongoDB as the database.

## Project Structure

```
/mongodb-backend
│
├── /src
│   ├── /config
│   │   ├── database.js       # MongoDB connection configuration
│   │   ├── default.js        # Default configuration settings
│   │   └── env.js            # Environment variables configuration
│   │
│   ├── /controllers
│   │   ├── authController.js           # Authentication controller
│   │   ├── endpointController.js       # Endpoint management controller
│   │   ├── applicationController.js    # Application management controller
│   │   ├── endpointMappingController.js # Endpoint-Application mapping controller
│   │   ├── firewallController.js       # Firewall rules controller
│   │   └── logsController.js           # Logs controller
│   │
│   ├── /middlewares
│   │   ├── authMiddleware.js           # Authentication middleware
│   │   ├── errorMiddleware.js          # Error handling middleware
│   │   └── validationMiddleware.js     # Request validation middleware
│   │
│   ├── /models
│   │   ├── User.js                     # User model
│   │   ├── Endpoint.js                 # Endpoint model
│   │   ├── Application.js              # Application model
│   │   ├── EndpointApplicationMapping.js # Mapping model
│   │   ├── TrafficLog.js               # Traffic logs model
│   │   ├── FirewallRule.js             # Firewall rules model
│   │   ├── Anomaly.js                  # Anomaly detection model
│   │   ├── Log.js                      # System logs model
│   │   └── index.js                    # Models index file
│   │
│   ├── /routes
│   │   ├── authRoutes.js               # Authentication routes
│   │   ├── endpointRoutes.js           # Endpoint management routes
│   │   ├── applicationRoutes.js        # Application management routes
│   │   ├── endpointMappingRoutes.js    # Endpoint-Application mapping routes
│   │   ├── firewallRoutes.js           # Firewall rules routes
│   │   └── logRoutes.js                # Logs routes
│   │
│   ├── /utils
│   │   ├── jwtUtils.js                 # JWT utility functions
│   │   └── logger.js                   # Logging utility
│   │
│   ├── /websocket
│   │   └── wsServer.js                 # WebSocket server for real-time communication
│   │
│   ├── app.js                          # Express app setup
│   ├── server.js                       # Server entry point
│   └── .env                            # Environment variables
│
├── package.json                        # Project dependencies and scripts
└── README.md                           # Project documentation
```

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)

## Installation

1. Clone the repository
2. Install dependencies:
   ```
   cd mongodb-backend
   npm install
   ```
3. Create a `.env` file based on `.env.example`:
   ```
   cp src/.env.example src/.env
   ```
4. Update the `.env` file with your MongoDB connection string and other settings

## Running the Server

### Development Mode
```
npm run dev
```

### Production Mode
```
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user
- `GET /api/auth/profile` - Get current user profile (protected)

### Endpoints
- `GET /api/endpoints` - Get all endpoints
- `GET /api/endpoints/:id` - Get a single endpoint
- `POST /api/endpoints` - Create a new endpoint
- `PUT /api/endpoints/:id` - Update an endpoint
- `DELETE /api/endpoints/:id` - Delete an endpoint
- `PATCH /api/endpoints/:id/status` - Update endpoint status

### Applications
- `GET /api/applications` - Get all applications
- `GET /api/applications/:id` - Get a single application
- `POST /api/applications` - Create a new application
- `PUT /api/applications/:id` - Update an application
- `DELETE /api/applications/:id` - Delete an application

### Endpoint-Application Mappings
- `GET /api/mapping` - Get all mappings
- `GET /api/mapping/endpoint/:endpointId` - Get mappings by endpoint
- `GET /api/mapping/application/:applicationId` - Get mappings by application
- `POST /api/mapping` - Create a new mapping
- `PATCH /api/mapping/:id` - Update mapping status
- `DELETE /api/mapping/:id` - Delete a mapping

### Firewall Rules
- `GET /api/firewall/rules` - Get all firewall rules
- `GET /api/firewall/rules/:id` - Get a single firewall rule
- `GET /api/firewall/rules/application/:applicationId` - Get rules by application
- `POST /api/firewall/rules` - Create a new firewall rule
- `PUT /api/firewall/rules/:id` - Update a firewall rule
- `DELETE /api/firewall/rules/:id` - Delete a firewall rule

### Logs
- `GET /api/logs/traffic` - Get all traffic logs
- `GET /api/logs/traffic/endpoint/:endpointId` - Get traffic logs by endpoint
- `GET /api/logs/traffic/application/:applicationId` - Get traffic logs by application
- `POST /api/logs/traffic` - Create a new traffic log
- `GET /api/logs/system` - Get all system logs
- `POST /api/logs/system` - Create a new system log
