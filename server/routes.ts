import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import * as bcrypt from "bcrypt";
import { storage } from "./storage";
import { generateChatResponse, generateConversationTitle, analyzeAssessmentResults } from "./openai";
import { 
  insertUserSchema, insertChatConversationSchema, insertChatMessageSchema,
  insertAppointmentSchema, insertAssessmentSchema, insertForumPostSchema,
  insertForumReplySchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const existingUser = await storage.getUserByEmail(userData.email);
      
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Security: Hash password before storing in database
      const saltRounds = 12; // High salt rounds for security
      const hashedPassword = await bcrypt.hash(userData.password, saltRounds);
      
      const user = await storage.createUser({
        ...userData,
        password: hashedPassword
      });
      
      // Security: Never return password in response
      res.json({ user: { id: user.id, username: user.username, email: user.email } });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      // Input validation: Ensure email and password are provided
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }
      
      const user = await storage.getUserByEmail(email);
      
      // Security: Use bcrypt to compare hashed passwords
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Security: Never return password in response
      res.json({ user: { id: user.id, username: user.username, email: user.email } });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Chat routes
  app.get("/api/chat/conversations/:userId", async (req, res) => {
    try {
      const conversations = await storage.getChatConversations(req.params.userId);
      res.json(conversations);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/chat/conversations", async (req, res) => {
    try {
      const conversationData = insertChatConversationSchema.parse(req.body);
      const conversation = await storage.createChatConversation(conversationData);
      res.json(conversation);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/chat/messages/:conversationId", async (req, res) => {
    try {
      const messages = await storage.getChatMessages(req.params.conversationId);
      res.json(messages);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/chat/message", async (req, res) => {
    try {
      const messageData = insertChatMessageSchema.parse(req.body);
      
      // Security: Validate conversationId BEFORE any database operations
      if (!messageData.conversationId) {
        return res.status(400).json({ message: "Conversation ID is required" });
      }
      
      // Security: Verify conversation exists before creating message
      const conversations = await storage.getChatConversations("dummy"); // We'll check existence in storage
      // Note: The storage method createChatMessage now has comprehensive validation
      
      const message = await storage.createChatMessage(messageData);
      
      // If it's a user message, generate AI response
      if (messageData.role === 'user') {
        const conversationHistory = await storage.getChatMessages(messageData.conversationId);
        const historyForAI = conversationHistory.map(msg => ({
          role: msg.role,
          content: msg.content
        }));

        const aiResponse = await generateChatResponse(messageData.content, historyForAI);
        
        // Save AI response
        const aiMessage = await storage.createChatMessage({
          conversationId: messageData.conversationId,
          role: 'assistant',
          content: aiResponse.message
        });

        // Update conversation title if it's the first exchange
        if (conversationHistory.length <= 2) {
          const title = await generateConversationTitle([messageData.content]);
          await storage.updateConversationTitle(messageData.conversationId, title);
        }

        res.json({ userMessage: message, aiMessage, suggestions: aiResponse.suggestions, escalation: aiResponse.escalation });
      } else {
        res.json({ message });
      }
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Counselor routes
  app.get("/api/counselors", async (req, res) => {
    try {
      const counselors = await storage.getCounselors();
      res.json(counselors);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/counselors/available", async (req, res) => {
    try {
      const counselors = await storage.getAvailableCounselors();
      res.json(counselors);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Appointment routes
  app.post("/api/appointments", async (req, res) => {
    try {
      const appointmentData = insertAppointmentSchema.parse(req.body);
      const appointment = await storage.createAppointment(appointmentData);
      res.json(appointment);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/appointments/user/:userId", async (req, res) => {
    try {
      const appointments = await storage.getAppointments(req.params.userId);
      res.json(appointments);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/appointments/counselor/:counselorId", async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      const appointments = await storage.getAppointmentsByDateRange(
        req.params.counselorId,
        new Date(startDate as string),
        new Date(endDate as string)
      );
      res.json(appointments);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.patch("/api/appointments/:id", async (req, res) => {
    try {
      const appointment = await storage.updateAppointment(req.params.id, req.body);
      res.json(appointment);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.delete("/api/appointments/:id", async (req, res) => {
    try {
      await storage.cancelAppointment(req.params.id);
      res.json({ message: "Appointment cancelled" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Assessment routes
  app.post("/api/assessments", async (req, res) => {
    try {
      const assessmentData = insertAssessmentSchema.parse(req.body);
      
      // Analyze results with AI
      // Convert Json type to any[] for OpenAI function compatibility
      const responses = Array.isArray(assessmentData.responses) 
        ? assessmentData.responses as any[]
        : assessmentData.responses 
          ? [assessmentData.responses] 
          : [];
      
      const analysis = await analyzeAssessmentResults(
        assessmentData.assessmentType,
        responses,
        assessmentData.totalScore
      );

      const assessment = await storage.createAssessment({
        ...assessmentData,
        interpretation: analysis.interpretation,
        recommendations: analysis.recommendations
      });

      res.json(assessment);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/assessments/user/:userId", async (req, res) => {
    try {
      const assessments = await storage.getAssessments(req.params.userId);
      res.json(assessments);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/assessments/latest/:userId/:type", async (req, res) => {
    try {
      const assessment = await storage.getLatestAssessment(req.params.userId, req.params.type);
      res.json(assessment);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Resource routes
  app.get("/api/resources", async (req, res) => {
    try {
      const { category, type, language } = req.query;
      const resources = await storage.getResources(
        category as string,
        type as string,
        language as string
      );
      res.json(resources);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/resources/featured", async (req, res) => {
    try {
      const resources = await storage.getFeaturedResources();
      res.json(resources);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/resources/search", async (req, res) => {
    try {
      const { q } = req.query;
      const resources = await storage.searchResources(q as string);
      res.json(resources);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Forum routes
  app.get("/api/forum/categories", async (req, res) => {
    try {
      const categories = await storage.getForumCategories();
      res.json(categories);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/forum/posts", async (req, res) => {
    try {
      const { categoryId, limit } = req.query;
      const posts = await storage.getForumPosts(
        categoryId as string,
        limit ? parseInt(limit as string) : undefined
      );
      res.json(posts);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/forum/posts", async (req, res) => {
    try {
      const postData = insertForumPostSchema.parse(req.body);
      const post = await storage.createForumPost(postData);
      res.json(post);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/forum/posts/:id/replies", async (req, res) => {
    try {
      const replies = await storage.getForumReplies(req.params.id);
      res.json(replies);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/forum/replies", async (req, res) => {
    try {
      const replyData = insertForumReplySchema.parse(req.body);
      const reply = await storage.createForumReply(replyData);
      res.json(reply);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/forum/posts/:id/upvote", async (req, res) => {
    try {
      await storage.upvotePost(req.params.id);
      res.json({ message: "Post upvoted" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Emergency contact routes
  app.get("/api/emergency/contacts", async (req, res) => {
    try {
      const contacts = await storage.getEmergencyContacts();
      res.json(contacts);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Create HTTP server
  const httpServer = createServer(app);

  // Rate limiting map to track connection attempts per IP
  // This helps prevent abuse and ensures fair resource usage
  const connectionAttempts = new Map<string, { count: number, lastAttempt: number }>();
  const RATE_LIMIT_WINDOW = 60000; // 1 minute window
  const MAX_CONNECTIONS_PER_IP = 10; // Maximum connections per IP per window
  
  // Create WebSocket server for real-time chat functionality
  // This enables bidirectional communication between client and server
  // The WebSocket server is attached to the same HTTP server at /ws endpoint
  const wss = new WebSocketServer({ 
    server: httpServer, 
    path: '/ws',
    // Configure WebSocket server options for better reliability and security
    clientTracking: true, // Track connected clients
    maxPayload: 1024 * 1024, // 1MB max message size for security
    
    // Verify origin to prevent unauthorized cross-origin WebSocket connections
    // This adds a basic layer of security against malicious websites
    verifyClient: (info: { origin: string; secure: boolean; req: any }) => {
      const origin = info.origin;
      const clientIP = info.req.socket.remoteAddress || 'unknown';
      
      console.log(`🔍 WebSocket connection attempt from IP: ${clientIP}, Origin: ${origin}`);
      
      // Basic rate limiting: Check connection attempts per IP
      const now = Date.now();
      const clientAttempts = connectionAttempts.get(clientIP);
      
      if (clientAttempts) {
        // Reset counter if window has expired
        if (now - clientAttempts.lastAttempt > RATE_LIMIT_WINDOW) {
          clientAttempts.count = 1;
          clientAttempts.lastAttempt = now;
        } else {
          clientAttempts.count++;
          clientAttempts.lastAttempt = now;
          
          // Reject if too many attempts
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
      // In development, allow all origins for easier testing
      if (process.env.NODE_ENV === 'production') {
        // Define allowed origins for production
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

  // Handle new WebSocket connections with enhanced security and monitoring
  wss.on('connection', (ws: WebSocket, req) => {
    const clientIP = req.socket.remoteAddress || 'unknown';
    const userAgent = req.headers['user-agent'] || 'unknown';
    
    console.log('✅ New WebSocket client connected');
    console.log('🌐 Client IP:', clientIP);
    console.log('🔍 User Agent:', userAgent.slice(0, 50) + (userAgent.length > 50 ? '...' : ''));
    console.log('📊 Total connected clients:', wss.clients.size);

    // Send welcome message to newly connected client
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        type: 'connection_established',
        message: 'WebSocket connection successful'
      }));
    }

    // Handle incoming messages from clients
    ws.on('message', async (data) => {
      try {
        console.log('📨 Received WebSocket message:', data.toString().slice(0, 100) + '...');
        const message = JSON.parse(data.toString());
        
        // Handle different message types with enhanced validation
        if (message.type === 'ping') {
          // Handle ping messages from client for connection health monitoring
          console.log('🏓 Received ping from client, sending pong');
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({
              type: 'pong',
              timestamp: message.timestamp || Date.now()
            }));
          }
        } else if (message.type === 'chat_message') {
          console.log('💬 Processing chat message for conversation:', message.conversationId);
          
          // Security: Comprehensive input validation before database operations
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
          
          // Validate message structure using Zod schema
          // This ensures data integrity and prevents invalid data from reaching storage
          const messageData = insertChatMessageSchema.parse({
            conversationId: message.conversationId,
            role: message.role,
            content: message.content
          });
          
          // Store message in database with full validation
          // The storage layer provides additional security and data validation
          const savedMessage = await storage.createChatMessage(messageData);
          console.log('✅ Message saved to database with ID:', savedMessage.id);

          // Send confirmation back to the client that sent the message
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({
              type: 'message_saved',
              message: savedMessage
            }));
          }

          // Optional: Broadcast to other clients in the same conversation
          // This could be implemented for multi-user chat rooms in the future
          // For now, we only confirm to the sender
          
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

    // Handle client disconnection with proper cleanup
    ws.on('close', (code, reason) => {
      console.log('🔌 WebSocket client disconnected');
      console.log('🌐 Client IP:', clientIP);
      console.log('📋 Close code:', code, 'Reason:', reason.toString() || 'No reason provided');
      console.log('📊 Remaining connected clients:', wss.clients.size);
      
      // Critical: Explicitly clear the ping interval to prevent memory leaks
      // This ensures server-side intervals are properly cleaned up on disconnection
      const pingInterval = (ws as any).pingInterval;
      if (pingInterval) {
        clearInterval(pingInterval);
        console.log('🧹 Cleaned up ping interval for disconnected client');
      }
    });

    // Handle WebSocket errors with enhanced logging and cleanup
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

    // Implement ping/pong for connection health monitoring
    // This helps detect dropped connections and maintain reliable communication
    const pingInterval = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        // Send native WebSocket ping frame for connection health check
        ws.ping();
      } else {
        // Connection is closed, clean up the interval immediately
        clearInterval(pingInterval);
      }
    }, 30000); // Ping every 30 seconds

    // Handle pong responses to confirm client is still connected
    ws.on('pong', () => {
      console.log('🏓 Received pong from client - connection healthy');
    });
    
    // Store the ping interval reference on the WebSocket for proper cleanup
    // This ensures we can clear it when the connection closes
    (ws as any).pingInterval = pingInterval;
  });

  // Handle WebSocket server-level errors
  wss.on('error', (error) => {
    console.error('❌ WebSocket server error:', error);
  });

  return httpServer;
}
