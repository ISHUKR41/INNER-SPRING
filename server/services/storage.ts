/**
 * Storage Service - Database interface and business logic layer
 * 
 * This module provides a clean abstraction layer between the API routes
 * and the actual database implementation. It encapsulates all database
 * operations and implements business logic for data validation and processing.
 * 
 * The storage service follows the repository pattern to:
 * - Separate business logic from database implementation details
 * - Provide consistent error handling and validation
 * - Enable easy testing through interface mocking
 * - Support future database migration or multi-database scenarios
 * 
 * Re-exports the storage implementation for use throughout the application.
 */

// Re-export the storage implementation from the main storage file
// This allows us to maintain a clean separation between the storage interface
// and its implementation while providing a service-oriented access pattern
export { storage, type IStorage } from "../storage";

/**
 * Storage Service Utilities
 * 
 * Additional utility functions for storage operations that don't fit
 * directly into the main storage interface but are useful for business logic.
 */

/**
 * Validates that a user exists before performing operations
 * @param userId - User ID to validate
 * @returns Promise<boolean> - Whether the user exists
 */
export async function validateUserExists(userId: string): Promise<boolean> {
  const { storage } = await import("../storage");
  const user = await storage.getUser(userId);
  return !!user;
}

/**
 * Validates that a conversation belongs to a specific user
 * @param conversationId - Conversation ID to validate
 * @param userId - User ID to check ownership
 * @returns Promise<boolean> - Whether the user owns the conversation
 */
export async function validateConversationOwnership(
  conversationId: string, 
  userId: string
): Promise<boolean> {
  const { storage } = await import("../storage");
  const conversations = await storage.getChatConversations(userId);
  return conversations.some(conv => conv.id === conversationId);
}

/**
 * Gets user-friendly error messages for common storage operations
 * @param error - Error object from storage operation
 * @returns string - User-friendly error message
 */
export function getStorageErrorMessage(error: any): string {
  if (error.message?.includes("already exists")) {
    return "This item already exists. Please try with different information.";
  }
  if (error.message?.includes("not found")) {
    return "The requested item could not be found.";
  }
  if (error.message?.includes("foreign key")) {
    return "This operation references data that doesn't exist.";
  }
  if (error.message?.includes("required")) {
    return "Some required information is missing.";
  }
  
  // Default to the original error message for unexpected errors
  return error.message || "An unexpected error occurred.";
}