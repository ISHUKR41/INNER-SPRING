/**
 * Chat Routes - AI chatbot conversation endpoints
 * 
 * This module handles all chat-related API endpoints including:
 * - Creating and managing chat conversations
 * - Sending and retrieving chat messages
 * - AI response generation through OpenAI integration
 * - Automatic conversation title generation
 * 
 * Features:
 * - Real-time messaging support
 * - AI-powered responses with context awareness
 * - Conversation history management
 * - Automatic title generation for new conversations
 */

import type { Express } from "express";
import { storage } from "../storage";
import { generateChatResponse, generateConversationTitle } from "../services/openai";
import { insertChatConversationSchema, insertChatMessageSchema } from "@shared/schema";

/**
 * Register chat routes with the Express app
 * @param app - Express application instance
 */
export function registerChatRoutes(app: Express): void {
  /**
   * Get User Conversations Endpoint
   * GET /api/chat/conversations/:userId
   * 
   * Retrieves all chat conversations for a specific user,
   * ordered by most recent activity.
   * 
   * @param userId - User ID to fetch conversations for
   * @returns {Array} List of chat conversations
   */
  app.get("/api/chat/conversations/:userId", async (req, res) => {
    try {
      const conversations = await storage.getChatConversations(req.params.userId);
      res.json(conversations);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  /**
   * Create New Conversation Endpoint
   * POST /api/chat/conversations
   * 
   * Creates a new chat conversation for a user.
   * Used when starting a new chat session.
   * 
   * @body {Object} conversationData - Conversation creation data
   * @returns {Object} Created conversation object
   */
  app.post("/api/chat/conversations", async (req, res) => {
    try {
      const conversationData = insertChatConversationSchema.parse(req.body);
      const conversation = await storage.createChatConversation(conversationData);
      res.json(conversation);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  /**
   * Get Conversation Messages Endpoint
   * GET /api/chat/messages/:conversationId
   * 
   * Retrieves all messages in a specific conversation,
   * ordered chronologically for proper chat display.
   * 
   * @param conversationId - Conversation ID to fetch messages for
   * @returns {Array} List of chat messages in chronological order
   */
  app.get("/api/chat/messages/:conversationId", async (req, res) => {
    try {
      const messages = await storage.getChatMessages(req.params.conversationId);
      res.json(messages);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  /**
   * Send Chat Message Endpoint
   * POST /api/chat/message
   * 
   * Processes new chat messages and generates AI responses.
   * This is the core endpoint for chat functionality:
   * 
   * 1. Validates and stores user message
   * 2. If it's a user message, generates AI response using conversation history
   * 3. Stores AI response and returns both messages
   * 4. Updates conversation title for new conversations
   * 
   * @body {Object} messageData - Message data with conversationId, role, content
   * @returns {Object} User message and AI response with suggestions
   */
  app.post("/api/chat/message", async (req, res) => {
    try {
      const messageData = insertChatMessageSchema.parse(req.body);
      
      // Security: Validate conversationId BEFORE any database operations
      if (!messageData.conversationId) {
        return res.status(400).json({ message: "Conversation ID is required" });
      }
      
      // Security: Verify conversation exists before creating message
      // Note: The storage method createChatMessage has comprehensive validation
      const message = await storage.createChatMessage(messageData);
      
      // If it's a user message, generate AI response using conversation context
      if (messageData.role === 'user') {
        const conversationHistory = await storage.getChatMessages(messageData.conversationId);
        const historyForAI = conversationHistory.map(msg => ({
          role: msg.role,
          content: msg.content
        }));

        // Generate contextual AI response using OpenAI service
        const aiResponse = await generateChatResponse(messageData.content, historyForAI);
        
        // Save AI response to conversation
        const aiMessage = await storage.createChatMessage({
          conversationId: messageData.conversationId,
          role: 'assistant',
          content: aiResponse.message
        });

        // Auto-generate conversation title for first exchange to improve UX
        if (conversationHistory.length <= 2) {
          const title = await generateConversationTitle([messageData.content]);
          await storage.updateConversationTitle(messageData.conversationId, title);
        }

        res.json({ 
          userMessage: message, 
          aiMessage, 
          suggestions: aiResponse.suggestions, 
          escalation: aiResponse.escalation 
        });
      } else {
        res.json({ message });
      }
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });
}