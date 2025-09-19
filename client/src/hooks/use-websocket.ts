import { useEffect, useRef, useState, useCallback } from 'react';
import type { WebSocketMessage } from '@/types';

interface UseWebSocketOptions {
  onMessage?: (message: WebSocketMessage) => void;
  onOpen?: () => void;
  onClose?: () => void;
  onError?: (error: Event) => void;
  reconnectAttempts?: number;
  reconnectInterval?: number;
}

interface UseWebSocketReturn {
  sendMessage: (message: WebSocketMessage) => void;
  connectionState: 'connecting' | 'connected' | 'disconnected' | 'error';
  reconnect: () => void;
}

/**
 * Custom hook for managing WebSocket connections with automatic reconnection
 * Used for real-time chat functionality and live updates
 */
export function useWebSocket(options: UseWebSocketOptions = {}): UseWebSocketReturn {
  const {
    onMessage,
    onOpen,
    onClose,
    onError,
    reconnectAttempts = 3,
    reconnectInterval = 3000,
  } = options;

  const ws = useRef<WebSocket | null>(null);
  // Use number type instead of NodeJS.Timeout for browser compatibility
  const reconnectTimeoutRef = useRef<number>();
  const pingIntervalRef = useRef<number>();
  const reconnectCountRef = useRef(0);
  const [connectionState, setConnectionState] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('disconnected');

  // Get WebSocket URL based on current protocol and properly handle port
  // This constructs the WebSocket URL to connect to the same server that serves the frontend
  const getWebSocketUrl = useCallback(() => {
    // Determine WebSocket protocol based on current page protocol
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    
    // Get hostname and port from current location
    // In development: window.location.host might be "localhost:5000" 
    // In production: window.location.host might be "mydomain.com"
    let host = window.location.host;
    
    // Handle cases where port is not included in window.location.host
    // This can happen in some development environments
    if (!host.includes(':') && window.location.hostname === 'localhost') {
      // Default to port 5000 in local development if no port specified
      host = `localhost:${window.location.port || '5000'}`;
    }
    
    // Construct WebSocket URL pointing to /ws endpoint on same server
    const wsUrl = `${protocol}//${host}/ws`;
    console.log('WebSocket connecting to:', wsUrl);
    
    return wsUrl;
  }, []);

  // Send message through WebSocket
  const sendMessage = useCallback((message: WebSocketMessage) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      try {
        ws.current.send(JSON.stringify(message));
      } catch (error) {
        console.error('Failed to send WebSocket message:', error);
      }
    } else {
      console.warn('WebSocket is not connected. Cannot send message.');
    }
  }, []);

  // Connect to WebSocket server with comprehensive error handling
  // This function establishes a WebSocket connection to the server's /ws endpoint
  // and sets up all event handlers for connection lifecycle management
  const connect = useCallback(() => {
    try {
      // Prevent duplicate connections: Check if socket is already open or connecting
      // This guards against race conditions and multiple connection attempts
      if (ws.current?.readyState === WebSocket.OPEN) {
        console.log('⚠️ WebSocket already connected, skipping connection attempt');
        return;
      }
      if (ws.current?.readyState === WebSocket.CONNECTING) {
        console.log('⚠️ WebSocket connection already in progress, skipping duplicate attempt');
        return;
      }
      
      const wsUrl = getWebSocketUrl();
      console.log('🔌 Attempting WebSocket connection to:', wsUrl);
      
      setConnectionState('connecting');
      
      // Create new WebSocket connection
      // Note: No token authentication is currently implemented in this version
      ws.current = new WebSocket(wsUrl);

      // Handle successful connection
      ws.current.onopen = () => {
        console.log('✅ WebSocket connection established successfully');
        setConnectionState('connected');
        reconnectCountRef.current = 0; // Reset reconnect count on successful connection
        
        // Clear any pending reconnection timeout to prevent race conditions
        // This ensures we don't have multiple reconnection attempts running
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
          reconnectTimeoutRef.current = undefined;
        }
        
        // Set up ping interval to maintain connection health
        // Send ping every 30 seconds to detect broken connections
        pingIntervalRef.current = window.setInterval(() => {
          if (ws.current?.readyState === WebSocket.OPEN) {
            // Note: Browser WebSocket API doesn't expose ping() method
            // We send a custom ping message that the server can respond to
            try {
              ws.current.send(JSON.stringify({ type: 'ping', timestamp: Date.now() }));
            } catch (error) {
              console.error('Failed to send ping:', error);
            }
          }
        }, 30000);
        
        onOpen?.();
      };

      // Handle incoming messages from server
      ws.current.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          console.log('📨 Received WebSocket message:', message.type);
          onMessage?.(message);
        } catch (error) {
          console.error('❌ Failed to parse WebSocket message:', error);
          console.error('Raw message data:', event.data);
        }
      };

      // Handle connection closure
      ws.current.onclose = (event) => {
        console.log('🔌 WebSocket connection closed');
        console.log('Close code:', event.code, 'Reason:', event.reason || 'No reason provided');
        setConnectionState('disconnected');
        
        // Clean up ping interval explicitly to prevent memory leaks
        if (pingIntervalRef.current) {
          clearInterval(pingIntervalRef.current);
          pingIntervalRef.current = undefined;
        }
        
        onClose?.();

        // Implement automatic reconnection logic
        // Code 1000 indicates normal closure, no need to reconnect
        // Code 1006 indicates abnormal closure (connection lost)
        const shouldReconnect = event.code !== 1000 && reconnectCountRef.current < reconnectAttempts;
        
        if (shouldReconnect) {
          reconnectCountRef.current++;
          console.log(`🔄 Attempting to reconnect (${reconnectCountRef.current}/${reconnectAttempts}) in ${reconnectInterval}ms...`);
          
          // Clear any existing reconnection timeout before setting a new one
          // This prevents multiple reconnection attempts from overlapping
          if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
          }
          
          reconnectTimeoutRef.current = window.setTimeout(() => {
            console.log('⏱️ Reconnect timeout triggered, attempting reconnection...');
            reconnectTimeoutRef.current = undefined;
            connect();
          }, reconnectInterval);
        } else if (reconnectCountRef.current >= reconnectAttempts) {
          console.log('❌ Max reconnection attempts reached. Please check your connection.');
          setConnectionState('error');
        }
      };

      // Handle WebSocket errors
      ws.current.onerror = (error) => {
        console.error('❌ WebSocket connection error occurred:', error);
        console.error('This often indicates network issues or server unavailability');
        setConnectionState('error');
        onError?.(error);
      };

    } catch (error) {
      console.error('❌ Failed to create WebSocket connection:', error);
      console.error('URL that failed:', getWebSocketUrl());
      setConnectionState('error');
    }
  }, [getWebSocketUrl, onMessage, onOpen, onClose, onError, reconnectAttempts, reconnectInterval]);

  // Manual reconnect function with proper cleanup
  const reconnect = useCallback(() => {
    // Clear any pending reconnection timeout to prevent conflicts
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = undefined;
    }
    
    // Clear ping interval if it exists
    if (pingIntervalRef.current) {
      clearInterval(pingIntervalRef.current);
      pingIntervalRef.current = undefined;
    }
    
    // Close existing connection if it exists
    if (ws.current) {
      ws.current.close(1000, 'Manual reconnect');
    }
    
    // Reset reconnect count and attempt new connection
    reconnectCountRef.current = 0;
    connect();
  }, [connect]);

  // Initialize connection on mount - use empty dependency array to prevent reconnections
  useEffect(() => {
    connect();

    // Comprehensive cleanup on unmount to prevent memory leaks
    return () => {
      // Clear reconnection timeout
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = undefined;
      }
      
      // Clear ping interval
      if (pingIntervalRef.current) {
        clearInterval(pingIntervalRef.current);
        pingIntervalRef.current = undefined;
      }
      
      // Close WebSocket connection gracefully
      if (ws.current) {
        ws.current.close(1000, 'Component unmounting');
        ws.current = null;
      }
    };
  }, []); // Empty dependency array to prevent reconnections on re-render

  // Handle page visibility changes to reconnect when tab becomes active
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && connectionState === 'disconnected') {
        reconnect();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [connectionState, reconnect]);

  return {
    sendMessage,
    connectionState,
    reconnect,
  };
}

// Specialized hook for chat functionality
export function useChatWebSocket(conversationId: string, onNewMessage?: (message: any) => void) {
  return useWebSocket({
    onMessage: (wsMessage) => {
      if (wsMessage.type === 'message_saved' && wsMessage.message) {
        onNewMessage?.(wsMessage.message);
      }
    },
    onOpen: () => {
      console.log('Chat WebSocket connected for conversation:', conversationId);
    },
    onClose: () => {
      console.log('Chat WebSocket disconnected for conversation:', conversationId);
    },
  });
}
