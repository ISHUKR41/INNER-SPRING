/**
 * Resources Routes - Mental health resources and educational content endpoints
 * 
 * This module handles all resource-related API endpoints including:
 * - Resource browsing with filtering by category, type, and language
 * - Featured content highlighting
 * - Full-text search across resource library
 * - Multi-format content support (videos, audio, PDFs, articles)
 * 
 * Features:
 * - Advanced filtering and search capabilities
 * - Multi-language content support
 * - Featured content promotion system
 * - Comprehensive resource metadata management
 */

import type { Express } from "express";
import { storage } from "../storage";

/**
 * Register resource routes with the Express app
 * @param app - Express application instance
 */
export function registerResourceRoutes(app: Express): void {
  /**
   * Get Resources with Filtering Endpoint
   * GET /api/resources
   * 
   * Retrieves mental health resources with optional filtering.
   * Supports filtering by category (anxiety, depression, stress, etc.),
   * content type (video, audio, pdf, article), and language.
   * 
   * @query category - Optional resource category filter
   * @query type - Optional content type filter (video, audio, pdf, article)
   * @query language - Optional language filter (en, es, fr, etc.)
   * @returns {Array} Filtered list of resources ordered by creation date
   */
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

  /**
   * Get Featured Resources Endpoint
   * GET /api/resources/featured
   * 
   * Retrieves a curated selection of featured mental health resources.
   * These are high-quality, popular, or particularly relevant resources
   * that are promoted for visibility on the homepage and main pages.
   * 
   * @returns {Array} List of featured resources (limited to 6 items)
   */
  app.get("/api/resources/featured", async (req, res) => {
    try {
      const resources = await storage.getFeaturedResources();
      res.json(resources);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  /**
   * Search Resources Endpoint
   * GET /api/resources/search
   * 
   * Performs full-text search across resource titles and descriptions.
   * Uses case-insensitive matching to find relevant content based on user queries.
   * Essential for helping users discover relevant mental health resources.
   * 
   * @query q - Search query string to match against titles and descriptions
   * @returns {Array} List of resources matching the search query
   */
  app.get("/api/resources/search", async (req, res) => {
    try {
      const { q } = req.query;
      const resources = await storage.searchResources(q as string);
      res.json(resources);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });
}