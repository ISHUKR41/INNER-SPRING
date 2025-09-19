/**
 * Emergency Routes - Crisis intervention and emergency contact endpoints
 * 
 * This module handles all emergency and crisis-related API endpoints including:
 * - Emergency contact information retrieval
 * - Crisis hotline and support service management
 * - Country-specific emergency resources
 * - Crisis contact management with priority ordering
 * 
 * Features:
 * - Immediate access to crisis intervention resources
 * - Geographic/country-specific emergency contacts
 * - Multiple contact methods (phone, SMS, chat, text)
 * - Priority-based contact ordering for urgent situations
 * - Real-time availability status for emergency services
 */

import type { Express } from "express";
import { storage } from "../storage";
import { insertCrisisContactSchema } from "@shared/schema";

/**
 * Register emergency routes with the Express app
 * @param app - Express application instance
 */
export function registerEmergencyRoutes(app: Express): void {
  /**
   * Get Emergency Contacts Endpoint
   * GET /api/emergency/contacts
   * 
   * Retrieves general emergency contacts and crisis intervention resources.
   * These are immediate-access contacts for users experiencing mental health emergencies.
   * 
   * @returns {Array} List of active emergency contacts
   */
  app.get("/api/emergency/contacts", async (req, res) => {
    try {
      const contacts = await storage.getEmergencyContacts();
      res.json(contacts);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  /**
   * Get Crisis Contacts with Country Filter Endpoint
   * GET /api/crisis/contacts
   * 
   * Retrieves crisis intervention contacts with optional country filtering.
   * This endpoint provides localized emergency resources that are relevant
   * to the user's geographic location and language preferences.
   * 
   * @query country - Optional country code filter for localized resources
   * @returns {Array} List of crisis contacts ordered by priority
   */
  app.get("/api/crisis/contacts", async (req, res) => {
    try {
      const { country } = req.query;
      const contacts = await storage.getCrisisContacts(country as string);
      res.json(contacts);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  /**
   * Get Specific Crisis Contact Endpoint
   * GET /api/crisis/contacts/:id
   * 
   * Retrieves detailed information for a specific crisis contact.
   * Used when users need complete contact details including
   * multiple contact methods and availability information.
   * 
   * @param id - Crisis contact ID to retrieve
   * @returns {Object} Complete crisis contact information
   */
  app.get("/api/crisis/contacts/:id", async (req, res) => {
    try {
      const contact = await storage.getCrisisContact(req.params.id);
      if (!contact) {
        return res.status(404).json({ message: "Crisis contact not found" });
      }
      res.json(contact);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  /**
   * Get Crisis Contacts by Type Endpoint
   * GET /api/crisis/contacts/type/:type
   * 
   * Retrieves crisis contacts filtered by service type (hotline, chat, text, etc.).
   * Allows users to find contacts based on their preferred communication method
   * or specific type of crisis support needed.
   * 
   * @param type - Contact type filter (hotline, chat, text, emergency, etc.)
   * @query country - Optional country filter for localized results
   * @returns {Array} List of crisis contacts of the specified type
   */
  app.get("/api/crisis/contacts/type/:type", async (req, res) => {
    try {
      const { country } = req.query;
      const contacts = await storage.getCrisisContactsByType(req.params.type, country as string);
      res.json(contacts);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  /**
   * Create Crisis Contact Endpoint
   * POST /api/crisis/contacts
   * 
   * Creates a new crisis contact resource.
   * This endpoint is typically used by administrators to add new
   * emergency resources and crisis intervention services.
   * 
   * @body {Object} contactData - Crisis contact information with validation
   * @returns {Object} Created crisis contact object
   */
  app.post("/api/crisis/contacts", async (req, res) => {
    try {
      const contactData = insertCrisisContactSchema.parse(req.body);
      const contact = await storage.createCrisisContact(contactData);
      res.status(201).json(contact);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  /**
   * Update Crisis Contact Endpoint
   * PUT /api/crisis/contacts/:id
   * 
   * Updates an existing crisis contact with new information.
   * Supports partial updates to keep emergency resources current
   * and accurate for users in crisis situations.
   * 
   * @param id - Crisis contact ID to update
   * @body {Object} updates - Partial contact data to update
   * @returns {Object} Updated crisis contact object
   */
  app.put("/api/crisis/contacts/:id", async (req, res) => {
    try {
      const updates = req.body; // Partial update, no need for full schema validation
      const contact = await storage.updateCrisisContact(req.params.id, updates);
      if (!contact) {
        return res.status(404).json({ message: "Crisis contact not found" });
      }
      res.json(contact);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  /**
   * Get Active Crisis Contacts Endpoint
   * GET /api/crisis/contacts/active/:country?
   * 
   * Retrieves only currently active crisis contacts.
   * This endpoint ensures users only see emergency resources
   * that are currently operational and available for immediate help.
   * 
   * @param country - Optional country parameter for localized active contacts
   * @returns {Array} List of currently active crisis contacts
   */
  app.get("/api/crisis/contacts/active/:country?", async (req, res) => {
    try {
      const country = req.params.country;
      const contacts = await storage.getActiveCrisisContacts(country);
      res.json(contacts);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });
}