1. Authentication Routes
   POST /auth/login
   Description: Logs in a user and returns a JWT token for authentication.
   Request Body:
   json
   Copy code
   {
   "username": "user@example.com",
   "password": "your_password"
   }
   Response:
   200 OK:
   json
   Copy code
   {
   "token": "JWT_TOKEN_HERE"
   }
   400 Bad Request: Invalid input or missing parameters.
   401 Unauthorized: Incorrect credentials.
   POST /auth/signup
   Description: Registers a new user.
   Request Body:
   json
   Copy code
   {
   "username": "newuser@example.com",
   "password": "new_password",
   "email": "newuser@example.com"
   }
   Response:
   201 Created:
   json
   Copy code
   {
   "message": "User successfully created"
   }
   400 Bad Request: Invalid input.
   POST /auth/logout
   Description: Logs out the user and invalidates the session.
   Response:
   200 OK:
   json
   Copy code
   {
   "message": "Logged out successfully"
   }
   401 Unauthorized: No active session.
2. Application Routes
   POST /applications
   Description: Creates a new application (protected route, requires JWT).
   Request Body:
   json
   Copy code
   {
   "name": "My New Application",
   "description": "A description of the application"
   }
   Response:
   201 Created:
   json
   Copy code
   {
   "id": 1,
   "name": "My New Application",
   "description": "A description of the application"
   }
   401 Unauthorized: Missing or invalid JWT token.
   GET /applications
   Description: Retrieves a list of all applications (protected route).
   Response:
   200 OK:
   json
   Copy code
   [
   {
   "id": 1,
   "name": "My New Application",
   "description": "A description of the application"
   }
   ]
   401 Unauthorized: Missing or invalid JWT token.
   PUT /applications/:id
   Description: Updates an existing application (protected route).
   Request Body:
   json
   Copy code
   {
   "name": "Updated Application Name",
   "description": "Updated description"
   }
   Response:
   200 OK:
   json
   Copy code
   {
   "id": 1,
   "name": "Updated Application Name",
   "description": "Updated description"
   }
   401 Unauthorized: Missing or invalid JWT token.
   DELETE /applications/:id
   Description: Deletes an existing application (protected route).
   Response:
   200 OK:
   json
   Copy code
   {
   "message": "Application deleted successfully"
   }
   401 Unauthorized: Missing or invalid JWT token.
3. Firewall Routes
   POST /firewall
   Description: Creates a new firewall rule (protected route).
   Request Body:
   json
   Copy code
   {
   "rule_name": "Block Malicious IP",
   "rule_details": "Block IP address 192.168.1.1"
   }
   Response:
   201 Created:
   json
   Copy code
   {
   "id": 1,
   "rule_name": "Block Malicious IP",
   "rule_details": "Block IP address 192.168.1.1"
   }
   401 Unauthorized: Missing or invalid JWT token.
   GET /firewall
   Description: Retrieves a list of all firewall rules (protected route).
   Response:
   200 OK:
   json
   Copy code
   [
   {
   "id": 1,
   "rule_name": "Block Malicious IP",
   "rule_details": "Block IP address 192.168.1.1"
   }
   ]
   401 Unauthorized: Missing or invalid JWT token.
   PUT /firewall/:id
   Description: Updates an existing firewall rule (protected route).
   Request Body:
   json
   Copy code
   {
   "rule_name": "Allow IP",
   "rule_details": "Allow IP address 192.168.1.1"
   }
   Response:
   200 OK:
   json
   Copy code
   {
   "id": 1,
   "rule_name": "Allow IP",
   "rule_details": "Allow IP address 192.168.1.1"
   }
   401 Unauthorized: Missing or invalid JWT token.
   DELETE /firewall/:id
   Description: Deletes an existing firewall rule (protected route).
   Response:
   200 OK:
   json
   Copy code
   {
   "message": "Firewall rule deleted successfully"
   }
   401 Unauthorized: Missing or invalid JWT token.
4. Traffic Routes
   GET /traffic
   Description: Retrieves traffic logs (protected route).
   Response:
   200 OK:
   json
   Copy code
   [
   {
   "id": 1,
   "ip": "192.168.1.1",
   "timestamp": "2024-11-23T12:34:56Z",
   "action": "Blocked"
   }
   ]
   401 Unauthorized: Missing or invalid JWT token.
   POST /traffic/analyze
   Description: Analyzes traffic logs (protected route).
   Request Body:
   json
   Copy code
   {
   "ip": "192.168.1.1",
   "action": "Blocked"
   }
   Response:
   200 OK:
   json
   Copy code
   {
   "analysis_result": "Malicious activity detected"
   }
   401 Unauthorized: Missing or invalid JWT token.
