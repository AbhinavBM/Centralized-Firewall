Directory Structure:
bash
Copy code
/project-root
│
├── /config
│ ├── default.js # Default configuration file (database, JWT, AWS, logging, etc.)
│ └── database.js # Sequelize database connection and authentication logic
│
├── /controllers
│ └── authController.js # Controller handling user authentication (signup, login)
│
├── /middlewares
│ ├── authMiddleware.js # Middleware for JWT authentication
│ └── errorMiddleware.js # Global error handling middleware
│
├── /models
│ └── User.js # Sequelize User model for user data and authentication
│
├── /routes
│ ├── authRoutes.js # Routes for user authentication (signup, login)
│ └── firewallRoutes.js # Routes for firewall management
│
├── /services
│ ├── authService.js # Service logic for user authentication (signup, login)
│ └── firewallService.js # Service logic for firewall management
│
├── /utils
│ └── jwtUtils.js # Utility functions related to JWT token generation and validation
│
├── app.js # Main Express app setup (middleware, routes, error handling)
├── server.js # Entry point for starting the server and database connection
├── .env # Environment variables (database credentials, JWT secret, etc.)
└── package.json # Node.js package file with dependencies and scripts
Brief Explanation of Each File:
/config/default.js:

Contains default configuration like port, database details, JWT secret, logging level, and AWS configurations.
Helps to centralize and manage environment variables and other config settings.
/config/database.js:

Handles Sequelize database connection and authentication.
Establishes the database connection using credentials from environment variables.
/controllers/authController.js:

Contains functions (signup, login) that interact with the authService to handle user registration and login requests.
Sends appropriate responses based on service outcomes.
/middlewares/authMiddleware.js:

Middleware that intercepts requests to check if a valid JWT token exists in the Authorization header.
Decodes the token and allows the request to proceed if valid.
/middlewares/errorMiddleware.js:

A global error handler that catches and logs errors in the system and sends a generic error message back to the client.
/models/User.js:

Sequelize model defining the structure of the User table in the database.
Includes fields like username, password_hash, and role.
/routes/authRoutes.js:

Defines routes for authentication-related operations such as signup and login.
Tied to authController for handling requests.
/routes/firewallRoutes.js:

Defines routes for firewall management (e.g., adding/removing firewall rules, fetching rule details).
Tied to corresponding service functions.
/services/authService.js:

Contains business logic for handling user authentication (signup, login).
Interacts with the User model to create users and authenticate logins.
/services/firewallService.js:

Contains business logic for managing firewall rules, including adding, removing, and listing rules.
/utils/jwtUtils.js:

Utility functions to generate and verify JWT tokens.
app.js:

Main Express application file.
Sets up middlewares (e.g., logging, CORS, body parsing) and routes for authentication and firewall management.
Includes global error handling and 404 handling.
server.js:

Entry point to the application.
Starts the server after verifying the database connection.
.env:

Stores sensitive environment variables like database credentials, JWT secrets, AWS keys, etc.
Loaded via dotenv into the application.
package.json:

Contains project dependencies and scripts (e.g., for starting the server).
You can use this structure and description as a reference to quickly ask for assistance with any specific file or functionality while building and maintaining your backend system!
