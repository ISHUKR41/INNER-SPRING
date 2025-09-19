/**
 * Assessments Routes - Mental health assessment endpoints
 * 
 * This module handles all assessment-related API endpoints including:
 * - Creating and storing mental health assessments (PHQ-9, GAD-7, GHQ)
 * - AI-powered analysis of assessment results
 * - User assessment history retrieval
 * - Latest assessment tracking for progress monitoring
 * 
 * Features:
 * - Integration with OpenAI for intelligent assessment analysis
 * - Support for multiple standardized assessment types
 * - Automatic interpretation and recommendation generation
 * - Progress tracking across multiple assessments
 */

import type { Express } from "express";
import { storage } from "../storage";
import { analyzeAssessmentResults } from "../services/openai";
import { insertAssessmentSchema } from "@shared/schema";

/**
 * Register assessment routes with the Express app
 * @param app - Express application instance
 */
export function registerAssessmentRoutes(app: Express): void {
  /**
   * Create New Assessment Endpoint
   * POST /api/assessments
   * 
   * Processes completed mental health assessments and generates AI analysis.
   * 
   * This endpoint:
   * 1. Validates assessment data using Zod schema
   * 2. Analyzes results using OpenAI for interpretation and recommendations
   * 3. Stores assessment with AI-generated insights
   * 4. Returns complete assessment with analysis
   * 
   * @body {Object} assessmentData - Assessment responses and metadata
   * @returns {Object} Complete assessment with AI analysis and recommendations
   */
  app.post("/api/assessments", async (req, res) => {
    try {
      const assessmentData = insertAssessmentSchema.parse(req.body);
      
      // Analyze results with AI for intelligent interpretation
      // Convert Json type to any[] for OpenAI function compatibility
      const responses = Array.isArray(assessmentData.responses) 
        ? assessmentData.responses as any[]
        : assessmentData.responses 
          ? [assessmentData.responses] 
          : [];
      
      // Generate AI-powered analysis with interpretation and recommendations
      const analysis = await analyzeAssessmentResults(
        assessmentData.assessmentType,
        responses,
        assessmentData.totalScore
      );

      // Store assessment with AI-generated insights
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

  /**
   * Get User Assessments Endpoint
   * GET /api/assessments/user/:userId
   * 
   * Retrieves all assessments completed by a specific user,
   * ordered by completion date (most recent first) for progress tracking.
   * 
   * @param userId - User ID to fetch assessments for
   * @returns {Array} List of user's assessments with analysis and recommendations
   */
  app.get("/api/assessments/user/:userId", async (req, res) => {
    try {
      const assessments = await storage.getAssessments(req.params.userId);
      res.json(assessments);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  /**
   * Get Latest Assessment by Type Endpoint
   * GET /api/assessments/latest/:userId/:type
   * 
   * Retrieves the most recent assessment of a specific type for a user.
   * Useful for tracking progress and showing current status for each assessment type.
   * 
   * @param userId - User ID to fetch assessment for
   * @param type - Assessment type (PHQ-9, GAD-7, GHQ, etc.)
   * @returns {Object} Most recent assessment of the specified type
   */
  app.get("/api/assessments/latest/:userId/:type", async (req, res) => {
    try {
      const assessment = await storage.getLatestAssessment(req.params.userId, req.params.type);
      res.json(assessment);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });
}