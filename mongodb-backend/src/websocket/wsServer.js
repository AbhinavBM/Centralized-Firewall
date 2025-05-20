const WebSocket = require('ws');
const logger = require('../utils/logger');
const { verifyToken } = require('../utils/jwtUtils');
const { User, Endpoint, TrafficLog, Anomaly } = require('../models');

/**
 * Initialize WebSocket server
 * @param {object} server - HTTP server instance
 */
const initWebSocketServer = (server) => {
  const wss = new WebSocket.Server({ server });

  // Store connected clients
  const clients = new Map();

  wss.on('connection', async (ws, req) => {
    try {
      // Extract token from URL query parameters
      const url = new URL(req.url, 'http://localhost');
      const token = url.searchParams.get('token');

      if (!token) {
        ws.close(4001, 'Authentication required');
        return;
      }

      // Verify token
      let decoded;
      try {
        decoded = verifyToken(token);
      } catch (error) {
        ws.close(4002, 'Invalid token');
        return;
      }

      // Get user from token
      const user = await User.findById(decoded.id);
      if (!user) {
        ws.close(4003, 'User not found');
        return;
      }

      // Store client with user info
      const clientId = user._id.toString();
      clients.set(clientId, {
        ws,
        user: {
          id: user._id,
          username: user.username,
          role: user.role
        }
      });

      logger.info(`WebSocket client connected: ${user.username} (${clientId})`);

      // Send welcome message
      ws.send(JSON.stringify({
        type: 'connection',
        message: 'Connected to WebSocket server',
        timestamp: new Date().toISOString()
      }));

      // Handle messages
      ws.on('message', async (message) => {
        try {
          const data = JSON.parse(message);

          // Handle different message types
          switch (data.type) {
            case 'ping':
              ws.send(JSON.stringify({
                type: 'pong',
                timestamp: new Date().toISOString()
              }));
              break;

            case 'subscribe':
              // Handle subscription to specific events
              if (data.target === 'endpoint' && data.id) {
                // Subscribe to specific endpoint events
                logger.info(`User ${user.username} subscribed to endpoint ${data.id} events`);
                // Store subscription info in client object
                const client = clients.get(clientId);
                if (client) {
                  client.subscriptions = client.subscriptions || {};
                  client.subscriptions.endpoints = client.subscriptions.endpoints || [];
                  if (!client.subscriptions.endpoints.includes(data.id)) {
                    client.subscriptions.endpoints.push(data.id);
                  }
                }
              } else if (data.target === 'application' && data.id) {
                // Subscribe to specific application events
                logger.info(`User ${user.username} subscribed to application ${data.id} events`);
                // Store subscription info in client object
                const client = clients.get(clientId);
                if (client) {
                  client.subscriptions = client.subscriptions || {};
                  client.subscriptions.applications = client.subscriptions.applications || [];
                  if (!client.subscriptions.applications.includes(data.id)) {
                    client.subscriptions.applications.push(data.id);
                  }
                }
              }
              break;

            case 'unsubscribe':
              // Handle unsubscription from specific events
              if (data.target === 'endpoint' && data.id) {
                // Unsubscribe from specific endpoint events
                logger.info(`User ${user.username} unsubscribed from endpoint ${data.id} events`);
                // Remove subscription info from client object
                const client = clients.get(clientId);
                if (client && client.subscriptions && client.subscriptions.endpoints) {
                  client.subscriptions.endpoints = client.subscriptions.endpoints.filter(id => id !== data.id);
                }
              } else if (data.target === 'application' && data.id) {
                // Unsubscribe from specific application events
                logger.info(`User ${user.username} unsubscribed from application ${data.id} events`);
                // Remove subscription info from client object
                const client = clients.get(clientId);
                if (client && client.subscriptions && client.subscriptions.applications) {
                  client.subscriptions.applications = client.subscriptions.applications.filter(id => id !== data.id);
                }
              }
              break;

            case 'getStatus':
              // Handle request for current system status
              if (data.target === 'system') {
                // Get system status overview
                const endpointCount = await Endpoint.countDocuments();
                const onlineEndpoints = await Endpoint.countDocuments({ status: 'online' });
                const recentTraffic = await TrafficLog.countDocuments({
                  timestamp: { $gte: new Date(Date.now() - 3600000) } // Last hour
                });
                const pendingAnomalies = await Anomaly.countDocuments({ resolved: false });

                ws.send(JSON.stringify({
                  type: 'systemStatus',
                  data: {
                    endpoints: {
                      total: endpointCount,
                      online: onlineEndpoints
                    },
                    traffic: {
                      lastHour: recentTraffic
                    },
                    anomalies: {
                      pending: pendingAnomalies
                    },
                    timestamp: new Date().toISOString()
                  }
                }));
              }
              break;

            default:
              logger.info(`Received message from ${user.username}: ${message}`);
              break;
          }
        } catch (error) {
          logger.error(`Error handling WebSocket message: ${error.message}`);
        }
      });

      // Handle disconnection
      ws.on('close', () => {
        clients.delete(clientId);
        logger.info(`WebSocket client disconnected: ${user.username} (${clientId})`);
      });

    } catch (error) {
      logger.error(`WebSocket connection error: ${error.message}`);
      ws.close(4000, 'Internal server error');
    }
  });

  // Broadcast message to all clients
  const broadcast = (message) => {
    const messageString = typeof message === 'string' ? message : JSON.stringify(message);

    clients.forEach((client) => {
      if (client.ws.readyState === WebSocket.OPEN) {
        client.ws.send(messageString);
      }
    });
  };

  // Broadcast message to specific role
  const broadcastToRole = (message, role) => {
    const messageString = typeof message === 'string' ? message : JSON.stringify(message);

    clients.forEach((client) => {
      if (client.ws.readyState === WebSocket.OPEN && client.user.role === role) {
        client.ws.send(messageString);
      }
    });
  };

  // Send message to specific client
  const sendToClient = (clientId, message) => {
    const client = clients.get(clientId);
    const messageString = typeof message === 'string' ? message : JSON.stringify(message);

    if (client && client.ws.readyState === WebSocket.OPEN) {
      client.ws.send(messageString);
      return true;
    }

    return false;
  };

  // Broadcast to subscribers of a specific endpoint
  const broadcastToEndpointSubscribers = (endpointId, message) => {
    const messageString = typeof message === 'string' ? message : JSON.stringify(message);

    clients.forEach((client) => {
      if (client.ws.readyState === WebSocket.OPEN &&
          client.subscriptions &&
          client.subscriptions.endpoints &&
          client.subscriptions.endpoints.includes(endpointId)) {
        client.ws.send(messageString);
      }
    });
  };

  // Broadcast to subscribers of a specific application
  const broadcastToApplicationSubscribers = (applicationId, message) => {
    const messageString = typeof message === 'string' ? message : JSON.stringify(message);

    clients.forEach((client) => {
      if (client.ws.readyState === WebSocket.OPEN &&
          client.subscriptions &&
          client.subscriptions.applications &&
          client.subscriptions.applications.includes(applicationId)) {
        client.ws.send(messageString);
      }
    });
  };

  // Return WebSocket server and utility functions
  return {
    wss,
    broadcast,
    broadcastToRole,
    sendToClient,
    broadcastToEndpointSubscribers,
    broadcastToApplicationSubscribers,
    getClients: () => clients
  };
};

module.exports = initWebSocketServer;
