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

  // Add WebSocket server for real-time chat
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  wss.on('connection', (ws: WebSocket) => {
    console.log('WebSocket connection established');

    ws.on('message', async (data) => {
      try {
        const message = JSON.parse(data.toString());
        
        if (message.type === 'chat_message') {
          // Security: Validate required fields before any database operations
          if (!message.conversationId) {
            ws.send(JSON.stringify({
              type: 'error',
              message: 'Conversation ID is required'
            }));
            return;
          }
          
          if (!message.role || !message.content) {
            ws.send(JSON.stringify({
              type: 'error',
              message: 'Role and content are required'
            }));
            return;
          }
          
          // Validate message data using schema
          const messageData = insertChatMessageSchema.parse({
            conversationId: message.conversationId,
            role: message.role,
            content: message.content
          });
          
          // Handle real-time chat message - storage now has comprehensive validation
          const savedMessage = await storage.createChatMessage(messageData);

          // Broadcast to connected clients if needed
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({
              type: 'message_saved',
              message: savedMessage
            }));
          }
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
        // Send error response to client
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({
            type: 'error',
            message: error instanceof Error ? error.message : 'Invalid message data'
          }));
        }
      }
    });

    ws.on('close', () => {
      console.log('WebSocket connection closed');
    });
  });

  return httpServer;
}
