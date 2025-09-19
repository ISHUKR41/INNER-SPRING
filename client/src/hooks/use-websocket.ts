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
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
  const reconnectCountRef = useRef(0);
  const [connectionState, setConnectionState] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('disconnected');

  // Get WebSocket URL based on current protocol
  const getWebSocketUrl = useCallback(() => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    return `${protocol}//${window.location.host}/ws`;
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

  // Connect to WebSocket
  const connect = useCallback(() => {
    try {
      setConnectionState('connecting');
      ws.current = new WebSocket(getWebSocketUrl());

      ws.current.onopen = () => {
        console.log('WebSocket connected');
        setConnectionState('connected');
        reconnectCountRef.current = 0; // Reset reconnect count on successful connection
        onOpen?.();
      };

      ws.current.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          onMessage?.(message);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      ws.current.onclose = (event) => {
        console.log('WebSocket disconnected:', event.code, event.reason);
        setConnectionState('disconnected');
        onClose?.();

        // Attempt to reconnect if not a manual close
        if (event.code !== 1000 && reconnectCountRef.current < reconnectAttempts) {
          reconnectCountRef.current++;
          console.log(`Attempting to reconnect (${reconnectCountRef.current}/${reconnectAttempts})...`);
          
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, reconnectInterval);
        }
      };

      ws.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        setConnectionState('error');
        onError?.(error);
      };

    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      setConnectionState('error');
    }
  }, [getWebSocketUrl, onMessage, onOpen, onClose, onError, reconnectAttempts, reconnectInterval]);

  // Manual reconnect function
  const reconnect = useCallback(() => {
    if (ws.current) {
      ws.current.close();
    }
    reconnectCountRef.current = 0;
    connect();
  }, [connect]);

  // Initialize connection on mount
  useEffect(() => {
    connect();

    // Cleanup on unmount
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (ws.current) {
        ws.current.close(1000, 'Component unmounting');
      }
    };
  }, [connect]);

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
