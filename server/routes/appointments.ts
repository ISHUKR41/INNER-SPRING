/**
 * Appointments Routes - Counselor booking and appointment management endpoints
 * 
 * This module handles all appointment-related API endpoints including:
 * - Counselor availability and listing
 * - Appointment creation, updating, and cancellation
 * - Date range queries for counselor schedules
 * - User appointment history
 * 
 * Features:
 * - Real-time availability checking
 * - Conflict prevention for double-booking
 * - Comprehensive appointment lifecycle management
 * - Integration with counselor availability system
 */

import type { Express } from "express";
import { storage } from "../storage";
import { insertAppointmentSchema } from "@shared/schema";

/**
 * Register appointment routes with the Express app
 * @param app - Express application instance
 */
export function registerAppointmentRoutes(app: Express): void {
  /**
   * Get All Counselors Endpoint
   * GET /api/counselors
   * 
   * Retrieves all available counselors for appointment booking.
   * Only returns counselors who are currently accepting appointments.
   * 
   * @returns {Array} List of available counselors with their details
   */
  app.get("/api/counselors", async (req, res) => {
    try {
      const counselors = await storage.getCounselors();
      res.json(counselors);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  /**
   * Get Available Counselors Endpoint
   * GET /api/counselors/available
   * 
   * Retrieves only counselors who are currently available for new appointments.
   * This endpoint filters out counselors who may be temporarily unavailable.
   * 
   * @returns {Array} List of currently available counselors
   */
  app.get("/api/counselors/available", async (req, res) => {
    try {
      const counselors = await storage.getAvailableCounselors();
      res.json(counselors);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  /**
   * Create New Appointment Endpoint
   * POST /api/appointments
   * 
   * Creates a new appointment between a user and counselor.
   * Validates that both user and counselor exist and counselor is available.
   * Prevents double-booking through database constraints.
   * 
   * @body {Object} appointmentData - Appointment details (user, counselor, date/time)
   * @returns {Object} Created appointment object
   */
  app.post("/api/appointments", async (req, res) => {
    try {
      const appointmentData = insertAppointmentSchema.parse(req.body);
      const appointment = await storage.createAppointment(appointmentData);
      res.json(appointment);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  /**
   * Get User Appointments Endpoint
   * GET /api/appointments/user/:userId
   * 
   * Retrieves all appointments for a specific user,
   * ordered by date (most recent first) for easy review.
   * 
   * @param userId - User ID to fetch appointments for
   * @returns {Array} List of user's appointments with counselor details
   */
  app.get("/api/appointments/user/:userId", async (req, res) => {
    try {
      const appointments = await storage.getAppointments(req.params.userId);
      res.json(appointments);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  /**
   * Get Counselor Schedule Endpoint
   * GET /api/appointments/counselor/:counselorId
   * 
   * Retrieves appointments for a specific counselor within a date range.
   * Used for availability checking and schedule management.
   * 
   * @param counselorId - Counselor ID to fetch schedule for
   * @query startDate - Start date for the query range
   * @query endDate - End date for the query range
   * @returns {Array} List of appointments in the specified date range
   */
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

  /**
   * Update Appointment Endpoint
   * PATCH /api/appointments/:id
   * 
   * Updates an existing appointment with new details.
   * Supports partial updates (only modified fields need to be provided).
   * 
   * @param id - Appointment ID to update
   * @body {Object} updates - Partial appointment data to update
   * @returns {Object} Updated appointment object
   */
  app.patch("/api/appointments/:id", async (req, res) => {
    try {
      const appointment = await storage.updateAppointment(req.params.id, req.body);
      res.json(appointment);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  /**
   * Cancel Appointment Endpoint
   * DELETE /api/appointments/:id
   * 
   * Cancels an existing appointment by marking it as cancelled.
   * This maintains appointment history while freeing up the time slot.
   * 
   * @param id - Appointment ID to cancel
   * @returns {Object} Confirmation message
   */
  app.delete("/api/appointments/:id", async (req, res) => {
    try {
      await storage.cancelAppointment(req.params.id);
      res.json({ message: "Appointment cancelled" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });
}