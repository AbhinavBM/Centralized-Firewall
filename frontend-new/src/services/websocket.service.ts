import { store } from '../store/store';
import { fetchSystemOverview } from '../store/slices/dashboardSlice';
import { fetchAnomalies } from '../store/slices/anomalySlice';

export class WebSocketService {
  private static instance: WebSocketService;
  private socket: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private pingInterval: NodeJS.Timeout | null = null;
  private url: string;

  private constructor(url: string) {
    this.url = url;
  }

  public static getInstance(url: string = import.meta.env.VITE_WS_URL || 'ws://localhost:5000/ws'): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService(url);
    }
    return WebSocketService.instance;
  }

  public connect(): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      console.log('WebSocket already connected');
      return;
    }

    try {
      // Get the authentication token from localStorage
      const token = localStorage.getItem('authToken');

      // Add the token as a URL parameter
      const wsUrlWithToken = token ? `${this.url}?token=${token}` : this.url;

      this.socket = new WebSocket(wsUrlWithToken);

      this.socket.onopen = this.handleOpen.bind(this);
      this.socket.onmessage = this.handleMessage.bind(this);
      this.socket.onclose = this.handleClose.bind(this);
      this.socket.onerror = this.handleError.bind(this);
    } catch (error) {
      console.error('WebSocket connection error:', error);
      this.attemptReconnect();
    }
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }

    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }

    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    this.reconnectAttempts = 0;
  }

  public send(data: any): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(data));
    } else {
      console.warn('WebSocket not connected. Cannot send message.');
    }
  }

  private handleOpen(event: Event): void {
    console.log('WebSocket connection established');
    this.reconnectAttempts = 0;

    // Start ping interval to keep connection alive
    this.pingInterval = setInterval(() => {
      this.send({ type: 'ping' });
    }, 30000);
  }

  private handleMessage(event: MessageEvent): void {
    try {
      const data = JSON.parse(event.data);
      console.log('WebSocket message received:', data);

      // Handle different message types
      switch (data.type) {
        case 'anomaly':
          // Refresh anomalies when a new one is detected
          store.dispatch(fetchAnomalies({ page: 1, limit: 20, filters: { resolved: false } }));
          break;
        case 'status_update':
          // Refresh dashboard data when status changes
          store.dispatch(fetchSystemOverview());
          break;
        case 'pong':
          // Server responded to our ping
          break;
        default:
          console.log('Unknown message type:', data.type);
      }
    } catch (error) {
      console.error('Error parsing WebSocket message:', error);
    }
  }

  private handleClose(event: CloseEvent): void {
    console.log('WebSocket connection closed:', event.code, event.reason);
    this.socket = null;

    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }

    // Handle authentication errors
    if (event.code === 4001 || event.code === 4002 || event.code === 4003) {
      console.warn('WebSocket authentication error:', event.reason);
      // Don't attempt to reconnect immediately for auth errors
      // The WebSocketContext will handle reconnection when the token changes
      return;
    }

    // Attempt to reconnect if the connection was closed unexpectedly
    // But only for certain codes that indicate temporary issues
    if (event.code !== 1000 && event.code !== 1001) {
      // Add a small delay before reconnecting to prevent rapid reconnection attempts
      setTimeout(() => {
        this.attemptReconnect();
      }, 1000);
    }
  }

  private handleError(event: Event): void {
    console.error('WebSocket error:', event);
    this.socket = null;
    this.attemptReconnect();
  }

  private attemptReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Maximum reconnect attempts reached. Giving up.');
      return;
    }

    // Check if we have a valid token before attempting to reconnect
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.warn('Cannot reconnect to WebSocket: No authentication token');
      return;
    }

    const delay = Math.min(1000 * 2 ** this.reconnectAttempts, 30000);
    console.log(`Attempting to reconnect in ${delay}ms...`);

    this.reconnectTimeout = setTimeout(() => {
      this.reconnectAttempts++;
      this.connect();
    }, delay);
  }
}

export const websocketService = WebSocketService.getInstance();
