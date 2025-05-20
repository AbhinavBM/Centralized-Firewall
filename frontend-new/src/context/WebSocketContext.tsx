import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { websocketService } from '../services/websocket.service';

interface WebSocketContextType {
  connected: boolean;
  connect: () => void;
  disconnect: () => void;
  send: (data: any) => void;
}

const WebSocketContext = createContext<WebSocketContextType>({
  connected: false,
  connect: () => {},
  disconnect: () => {},
  send: () => {},
});

export const useWebSocket = () => useContext(WebSocketContext);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [connected, setConnected] = useState(false);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  // Get the auth token from localStorage
  const authToken = localStorage.getItem('authToken');

  // Add a ref to track connection attempts
  const connectionAttemptRef = React.useRef(false);
  // Add a ref to track the current token
  const currentTokenRef = React.useRef<string | null>(null);

  useEffect(() => {
    // Connect to WebSocket when user is authenticated
    if (isAuthenticated && authToken) {
      // Only attempt to connect if we haven't tried yet or if the token changed
      if (!connectionAttemptRef.current || currentTokenRef.current !== authToken) {
        // Update the current token ref
        currentTokenRef.current = authToken;

        // Disconnect first to ensure we're using the latest token
        disconnect();

        // Add a small delay to prevent rapid reconnections
        setTimeout(() => {
          // Then connect with the new token
          connect();
          connectionAttemptRef.current = true;
        }, 500);
      }
    } else {
      disconnect();
      connectionAttemptRef.current = false;
      currentTokenRef.current = null;
    }

    // Cleanup on unmount
    return () => {
      disconnect();
    };
  }, [isAuthenticated, authToken]); // Remove connected from dependencies to prevent loops

  // Add a debounce timer ref
  const debounceTimerRef = React.useRef<NodeJS.Timeout | null>(null);

  const connect = () => {
    try {
      // Only connect if we have a token
      const token = localStorage.getItem('authToken');
      if (token) {
        // Clear any existing debounce timer
        if (debounceTimerRef.current) {
          clearTimeout(debounceTimerRef.current);
        }

        // Debounce the connection to prevent multiple rapid connections
        debounceTimerRef.current = setTimeout(() => {
          // Only connect if not already connected
          if (!connected) {
            websocketService.connect();
            setConnected(true);
          }
          debounceTimerRef.current = null;
        }, 300);
      } else {
        console.warn('Cannot connect to WebSocket: No authentication token');
        setConnected(false);
      }
    } catch (error) {
      console.error('Failed to connect to WebSocket:', error);
      setConnected(false);
    }
  };

  const disconnect = () => {
    try {
      // Clear any pending debounce timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }

      websocketService.disconnect();
      setConnected(false);
    } catch (error) {
      console.error('Failed to disconnect from WebSocket:', error);
    }
  };

  const send = (data: any) => {
    try {
      websocketService.send(data);
    } catch (error) {
      console.error('Failed to send WebSocket message:', error);
    }
  };

  const value = {
    connected,
    connect,
    disconnect,
    send,
  };

  return <WebSocketContext.Provider value={value}>{children}</WebSocketContext.Provider>;
};

export default WebSocketContext;
