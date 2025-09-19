/**
 * Forum Routes - Peer support community endpoints
 * 
 * This module handles all forum-related API endpoints including:
 * - Forum category management for organized discussions
 * - Post creation, retrieval, and moderation
 * - Reply system for threaded conversations
 * - Upvoting system for community engagement
 * - Content moderation and approval workflows
 * 
 * Features:
 * - Anonymous posting for privacy and safety
 * - Moderation system with approval workflows
 * - Community engagement through upvoting
 * - Categorized discussions for better organization
 * - Threaded replies for structured conversations
 */

import type { Express } from "express";
import { storage } from "../storage";
import { insertForumPostSchema, insertForumReplySchema } from "@shared/schema";

/**
 * Register forum routes with the Express app
 * @param app - Express application instance
 */
export function registerForumRoutes(app: Express): void {
  /**
   * Get Forum Categories Endpoint
   * GET /api/forum/categories
   * 
   * Retrieves all active forum categories for organizing discussions.
   * Categories help users find relevant conversations and maintain
   * organized community discussions around specific topics.
   * 
   * @returns {Array} List of active forum categories
   */
  app.get("/api/forum/categories", async (req, res) => {
    try {
      const categories = await storage.getForumCategories();
      res.json(categories);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  /**
   * Get Forum Posts Endpoint
   * GET /api/forum/posts
   * 
   * Retrieves approved forum posts with optional category filtering.
   * Only returns posts that have been moderated and approved to ensure
   * community safety and content quality.
   * 
   * @query categoryId - Optional category filter for specific discussion topics
   * @query limit - Optional limit for number of posts (default: 20)
   * @returns {Array} List of approved forum posts ordered by creation date
   */
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

  /**
   * Create Forum Post Endpoint
   * POST /api/forum/posts
   * 
   * Creates a new forum post for community discussion.
   * Posts are submitted for moderation before appearing publicly
   * to maintain community safety and content standards.
   * 
   * @body {Object} postData - Post data including title, content, category
   * @returns {Object} Created post object (pending approval)
   */
  app.post("/api/forum/posts", async (req, res) => {
    try {
      const postData = insertForumPostSchema.parse(req.body);
      const post = await storage.createForumPost(postData);
      res.json(post);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  /**
   * Get Post Replies Endpoint
   * GET /api/forum/posts/:id/replies
   * 
   * Retrieves all approved replies for a specific forum post.
   * Replies are ordered chronologically to maintain conversation flow
   * and only approved replies are shown for community safety.
   * 
   * @param id - Post ID to fetch replies for
   * @returns {Array} List of approved replies ordered by creation date
   */
  app.get("/api/forum/posts/:id/replies", async (req, res) => {
    try {
      const replies = await storage.getForumReplies(req.params.id);
      res.json(replies);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  /**
   * Create Forum Reply Endpoint
   * POST /api/forum/replies
   * 
   * Creates a new reply to an existing forum post.
   * Replies support the threaded conversation system and undergo
   * moderation before being visible to maintain community standards.
   * 
   * @body {Object} replyData - Reply data including post ID and content
   * @returns {Object} Created reply object (pending approval)
   */
  app.post("/api/forum/replies", async (req, res) => {
    try {
      const replyData = insertForumReplySchema.parse(req.body);
      const reply = await storage.createForumReply(replyData);
      res.json(reply);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  /**
   * Upvote Post Endpoint
   * POST /api/forum/posts/:id/upvote
   * 
   * Increases the upvote count for a forum post.
   * The upvoting system helps surface helpful and relevant content
   * within the community, improving content discovery.
   * 
   * @param id - Post ID to upvote
   * @returns {Object} Confirmation message
   */
  app.post("/api/forum/posts/:id/upvote", async (req, res) => {
    try {
      await storage.upvotePost(req.params.id);
      res.json({ message: "Post upvoted" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });
}