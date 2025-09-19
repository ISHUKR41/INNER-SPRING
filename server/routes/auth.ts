/**
 * Authentication Routes - User registration and login endpoints
 * 
 * This module handles all authentication-related API endpoints including:
 * - User registration with password hashing
 * - User login with credential validation
 * - Security measures including bcrypt password hashing
 * 
 * All endpoints follow security best practices:
 * - Passwords are hashed with high salt rounds (12)
 * - Passwords are never returned in API responses
 * - Input validation using Zod schemas
 * - Proper error handling with appropriate HTTP status codes
 */

import type { Express } from "express";
import * as bcrypt from "bcrypt";
import { storage } from "../storage";
import { insertUserSchema } from "@shared/schema";

/**
 * Register authentication routes with the Express app
 * @param app - Express application instance
 */
export function registerAuthRoutes(app: Express): void {
  /**
   * User Registration Endpoint
   * POST /api/auth/register
   * 
   * Creates a new user account with encrypted password storage.
   * Validates that email is unique before creating the account.
   * 
   * @body {Object} userData - User registration data (validated by insertUserSchema)
   * @returns {Object} User object without password field
   */
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

  /**
   * User Login Endpoint
   * POST /api/auth/login
   * 
   * Authenticates user credentials and returns user information.
   * Uses bcrypt to verify password against stored hash.
   * 
   * @body {Object} credentials - Login credentials { email, password }
   * @returns {Object} User object without password field
   */
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
}