/**
 * Routes Index - Central route registration and WebSocket server setup
 * 
 * This module serves as the main entry point for all API routes and WebSocket functionality.
 * It coordinates the registration of all feature-specific routes and sets up the WebSocket
 * server for real-time chat communication.
 * 
 * Architecture:
 * - Feature-based route organization for maintainability
 * - Centralized WebSocket server management
 * - Rate limiting and security for WebSocket connections
 * - Comprehensive error handling and logging
 * 
 * The module exports a single registerRoutes function that:
 * 1. Registers all feature routes with the Express app
 * 2. Creates and configures the HTTP server
 * 3. Sets up WebSocket server with security measures
 * 4. Implements connection management and message routing
 */

import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { registerAuthRoutes } from "./auth";
import { registerChatRoutes } from "./chat";
import { registerAppointmentRoutes } from "./appointments";
import { registerAssessmentRoutes } from "./assessments";
import { registerResourceRoutes } from "./resources";
import { registerForumRoutes } from "./forum";
import { registerEmergencyRoutes } from "./emergency";
import { storage } from "../storage";
import { insertChatMessageSchema } from "@shared/schema";

/**
 * Register all API routes and create HTTP server with WebSocket support
 * 
 * This function coordinates the setup of:
 * - All REST API endpoints organized by feature
 * - WebSocket server for real-time chat functionality
 * - Security measures including rate limiting and origin verification
 * - Connection management and message routing
 * 
 * @param app - Express application instance
 * @returns Promise<Server> - HTTP server with WebSocket support
 */
export async function registerRoutes(app: Express): Promise<Server> {
  // Register feature-specific routes for organized API structure
  registerAuthRoutes(app);        // Authentication endpoints (/api/auth/*)
  registerChatRoutes(app);        // Chat and conversation endpoints (/api/chat/*)
  registerAppointmentRoutes(app); // Appointment and counselor endpoints (/api/appointments/*, /api/counselors/*)
  registerAssessmentRoutes(app);  // Mental health assessment endpoints (/api/assessments/*)
  registerResourceRoutes(app);    // Educational resource endpoints (/api/resources/*)
  registerForumRoutes(app);       // Community forum endpoints (/api/forum/*)
  registerEmergencyRoutes(app);   // Emergency and crisis endpoints (/api/emergency/*, /api/crisis/*)

  // Create HTTP server for both REST API and WebSocket support
  const httpServer = createServer(app);

  // Rate limiting configuration to prevent abuse and ensure fair resource usage
  const connectionAttempts = new Map<string, { count: number, lastAttempt: number }>();
  const RATE_LIMIT_WINDOW = 60000; // 1 minute window for rate limiting
  const MAX_CONNECTIONS_PER_IP = 50; // Maximum connections per IP per window (increased for development)
  
  /**
   * WebSocket Server Configuration
   * 
   * Creates a WebSocket server for real-time chat functionality with:
   * - Security measures including origin verification and rate limiting
   * - Connection tracking and management
   * - Message validation and routing
   * - Proper error handling and cleanup
   */
  const wss = new WebSocketServer({ 
    server: httpServer, 
    path: '/ws',
    // Configure WebSocket server options for reliability and security
    clientTracking: true, // Track connected clients for management
    maxPayload: 1024 * 1024, // 1MB max message size for security
    
    /**
     * WebSocket Connection Verification
     * 
     * Implements security measures to verify incoming WebSocket connections:
     * - Rate limiting to prevent abuse
     * - Origin verification for production security
     * - IP-based connection tracking
     * 
     * @param info - Connection information including origin and request details
     * @returns boolean - Whether to accept the connection
     */
    verifyClient: (info: { origin: string; secure: boolean; req: any }) => {
      const origin = info.origin;
      const clientIP = info.req.socket.remoteAddress || 'unknown';
      
      console.log(`🔍 WebSocket connection attempt from IP: ${clientIP}, Origin: ${origin}`);
      
      // Implement rate limiting to prevent connection spam
      const now = Date.now();
      const clientAttempts = connectionAttempts.get(clientIP);
      
      if (clientAttempts) {
        // Reset counter if rate limit window has expired
        if (now - clientAttempts.lastAttempt > RATE_LIMIT_WINDOW) {
          clientAttempts.count = 1;
          clientAttempts.lastAttempt = now;
        } else {
          clientAttempts.count++;
          clientAttempts.lastAttempt = now;
          
          // Reject connection if rate limit exceeded
          if (clientAttempts.count > MAX_CONNECTIONS_PER_IP) {
            console.log(`❌ Rate limit exceeded for IP: ${clientIP} (${clientAttempts.count} attempts)`);
            return false;
          }
        }
      } else {
        // First connection attempt from this IP
        connectionAttempts.set(clientIP, { count: 1, lastAttempt: now });
      }
      
      // Origin verification for production security
      if (process.env.NODE_ENV === 'production') {
        // Define allowed origins for production environment
        const allowedOrigins = [
          `https://${process.env.REPL_SLUG}--${process.env.REPL_OWNER}.replit.app`,
          'https://localhost:5000', // Allow secure localhost in production
        ];
        
        // Reject connections from unauthorized origins
        if (origin && !allowedOrigins.some(allowed => origin.startsWith(allowed))) {
          console.log(`❌ Unauthorized origin rejected: ${origin}`);
          return false;
        }
      }
      
      console.log(`✅ WebSocket connection authorized for IP: ${clientIP}`);
      return true;
    }
  });

  console.log('🔌 WebSocket server initialized at /ws endpoint');

  /**
   * WebSocket Connection Handler
   * 
   * Manages new WebSocket connections with:
   * - Connection logging and monitoring
   * - Welcome message delivery
   * - Message routing and validation
   * - Error handling and cleanup
   */
  wss.on('connection', (ws: WebSocket, req) => {
    const clientIP = req.socket.remoteAddress || 'unknown';
    const userAgent = req.headers['user-agent'] || 'unknown';
    
    console.log('✅ New WebSocket client connected');
    console.log('🌐 Client IP:', clientIP);
    console.log('🔍 User Agent:', userAgent.slice(0, 50) + (userAgent.length > 50 ? '...' : ''));
    console.log('📊 Total connected clients:', wss.clients.size);

    // Send welcome message to establish connection
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        type: 'connection_established',
        message: 'WebSocket connection successful'
      }));
    }

    /**
     * Message Handler
     * 
     * Processes incoming WebSocket messages with comprehensive validation:
     * - Message type routing (ping/pong, chat messages)
     * - Schema validation for chat messages
     * - Database operations with error handling
     * - Response formatting and delivery
     */
    ws.on('message', async (data) => {
      try {
        console.log('📨 Received WebSocket message:', data.toString().slice(0, 100) + '...');
        const message = JSON.parse(data.toString());
        
        // Handle different message types with proper validation
        if (message.type === 'ping') {
          // Handle ping messages for connection health monitoring
          console.log('🏓 Received ping from client, sending pong');
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({
              type: 'pong',
              timestamp: message.timestamp || Date.now()
            }));
          }
        } else if (message.type === 'chat_message') {
          console.log('💬 Processing chat message for conversation:', message.conversationId);
          
          // Comprehensive input validation before database operations
          if (!message.conversationId) {
            console.log('❌ Rejected message: Missing conversation ID');
            ws.send(JSON.stringify({
              type: 'error',
              message: 'Conversation ID is required'
            }));
            return;
          }
          
          if (!message.role || !message.content) {
            console.log('❌ Rejected message: Missing role or content');
            ws.send(JSON.stringify({
              type: 'error',
              message: 'Role and content are required'
            }));
            return;
          }
          
          // Validate message structure using Zod schema for data integrity
          const messageData = insertChatMessageSchema.parse({
            conversationId: message.conversationId,
            role: message.role,
            content: message.content
          });
          
          // Store message in database with full validation and security checks
          const savedMessage = await storage.createChatMessage(messageData);
          console.log('✅ Message saved to database with ID:', savedMessage.id);

          // Send confirmation back to the client that sent the message
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({
              type: 'message_saved',
              message: savedMessage
            }));
          }
          
        } else {
          console.log('⚠️ Unknown message type received:', message.type);
          ws.send(JSON.stringify({
            type: 'error',
            message: `Unknown message type: ${message.type}`
          }));
        }
        
      } catch (error) {
        console.error('❌ WebSocket message processing error:', error);
        
        // Send detailed error information to client for debugging
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({
            type: 'error',
            message: error instanceof Error ? error.message : 'Invalid message data',
            details: process.env.NODE_ENV === 'development' ? error : undefined
          }));
        }
      }
    });

    /**
     * Connection Close Handler
     * 
     * Handles client disconnection with proper cleanup:
     * - Connection logging and monitoring
     * - Resource cleanup (ping intervals)
     * - Connection count tracking
     */
    ws.on('close', (code, reason) => {
      console.log('🔌 WebSocket client disconnected');
      console.log('🌐 Client IP:', clientIP);
      console.log('📋 Close code:', code, 'Reason:', reason.toString() || 'No reason provided');
      console.log('📊 Remaining connected clients:', wss.clients.size);
      
      // Clean up ping interval to prevent memory leaks
      const pingInterval = (ws as any).pingInterval;
      if (pingInterval) {
        clearInterval(pingInterval);
        console.log('🧹 Cleaned up ping interval for disconnected client');
      }
    });

    /**
     * Error Handler
     * 
     * Handles WebSocket errors with logging and cleanup:
     * - Error logging with client information
     * - Resource cleanup on error
     * - Connection monitoring
     */
    ws.on('error', (error) => {
      console.error('❌ WebSocket client error occurred');
      console.error('🌐 Client IP:', clientIP);
      console.error('📋 Error details:', error.message || error);
      
      // Clean up ping interval on error as well
      const pingInterval = (ws as any).pingInterval;
      if (pingInterval) {
        clearInterval(pingInterval);
        console.log('🧹 Cleaned up ping interval due to client error');
      }
    });

    /**
     * Connection Health Monitoring
     * 
     * Implements ping/pong for connection health monitoring:
     * - Regular ping messages to check connection status
     * - Automatic cleanup on connection failure
     * - Prevents zombie connections
     */
    const pingInterval = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.ping();
      } else {
        clearInterval(pingInterval);
      }
    }, 30000); // Ping every 30 seconds

    // Store ping interval for cleanup
    (ws as any).pingInterval = pingInterval;

    // Handle pong responses for connection health
    ws.on('pong', () => {
      console.log('🏓 Received pong from client - connection healthy');
    });
  });

  // Global WebSocket server error handler
  wss.on('error', (error) => {
    console.error('❌ WebSocket server error:', error);
  });

  // Return HTTP server with WebSocket support attached
  return httpServer;
}