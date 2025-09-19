/**
 * Validation Utilities - Common validation functions for server-side operations
 * 
 * This module provides reusable validation functions that are used across
 * different parts of the server application. These utilities help ensure
 * data integrity, security, and consistent validation logic.
 * 
 * Features:
 * - Email and password validation
 * - Date and time validation for appointments
 * - Content moderation and safety checks
 * - Input sanitization utilities
 * - Security validation helpers
 */

/**
 * Validates email format using a comprehensive regex pattern
 * @param email - Email address to validate
 * @returns boolean - Whether the email format is valid
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.toLowerCase());
}

/**
 * Validates password strength requirements
 * @param password - Password to validate
 * @returns object - Validation result with details
 */
export function validatePassword(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }
  
  if (!/\d/.test(password)) {
    errors.push("Password must contain at least one number");
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push("Password must contain at least one special character");
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validates that an appointment time is in the future and during business hours
 * @param dateTime - Appointment date and time
 * @returns object - Validation result with details
 */
export function validateAppointmentTime(dateTime: Date): {
  isValid: boolean;
  error?: string;
} {
  const now = new Date();
  const appointmentDate = new Date(dateTime);
  
  // Check if appointment is in the future
  if (appointmentDate <= now) {
    return {
      isValid: false,
      error: "Appointment must be scheduled for a future date and time"
    };
  }
  
  // Check if appointment is within the next 6 months
  const sixMonthsFromNow = new Date();
  sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);
  
  if (appointmentDate > sixMonthsFromNow) {
    return {
      isValid: false,
      error: "Appointments cannot be scheduled more than 6 months in advance"
    };
  }
  
  // Check business hours (9 AM to 6 PM, Monday to Friday)
  const hour = appointmentDate.getHours();
  const dayOfWeek = appointmentDate.getDay(); // 0 = Sunday, 6 = Saturday
  
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    return {
      isValid: false,
      error: "Appointments are only available Monday through Friday"
    };
  }
  
  if (hour < 9 || hour >= 18) {
    return {
      isValid: false,
      error: "Appointments are only available between 9:00 AM and 6:00 PM"
    };
  }
  
  return { isValid: true };
}

/**
 * Sanitizes user input to prevent XSS and other injection attacks
 * @param input - User input string to sanitize
 * @returns string - Sanitized input
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>'"&]/g, '') // Remove potential HTML/script tags
    .trim() // Remove leading/trailing whitespace
    .substring(0, 10000); // Limit length to prevent memory issues
}

/**
 * Validates forum post content for community guidelines
 * @param content - Post content to validate
 * @returns object - Validation result with details
 */
export function validateForumContent(content: string): {
  isValid: boolean;
  error?: string;
} {
  const sanitized = sanitizeInput(content);
  
  if (sanitized.length < 10) {
    return {
      isValid: false,
      error: "Post content must be at least 10 characters long"
    };
  }
  
  if (sanitized.length > 5000) {
    return {
      isValid: false,
      error: "Post content cannot exceed 5000 characters"
    };
  }
  
  // Basic content filtering (can be enhanced with more sophisticated checks)
  const prohibitedWords = ['spam', 'harmful', 'inappropriate']; // Example list
  const hasProhibitedContent = prohibitedWords.some(word => 
    sanitized.toLowerCase().includes(word)
  );
  
  if (hasProhibitedContent) {
    return {
      isValid: false,
      error: "Content violates community guidelines"
    };
  }
  
  return { isValid: true };
}

/**
 * Validates user ID format (UUID)
 * @param userId - User ID to validate
 * @returns boolean - Whether the user ID format is valid
 */
export function isValidUserId(userId: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(userId);
}

/**
 * Validates assessment responses for completeness and format
 * @param responses - Array of assessment responses
 * @param expectedCount - Expected number of responses
 * @returns object - Validation result with details
 */
export function validateAssessmentResponses(
  responses: any[], 
  expectedCount: number
): {
  isValid: boolean;
  error?: string;
} {
  if (!Array.isArray(responses)) {
    return {
      isValid: false,
      error: "Responses must be provided as an array"
    };
  }
  
  if (responses.length !== expectedCount) {
    return {
      isValid: false,
      error: `Assessment requires exactly ${expectedCount} responses, but ${responses.length} were provided`
    };
  }
  
  // Validate each response has required fields
  for (let i = 0; i < responses.length; i++) {
    const response = responses[i];
    
    if (!response.questionId || typeof response.value !== 'number') {
      return {
        isValid: false,
        error: `Response ${i + 1} is missing required fields (questionId and value)`
      };
    }
    
    // Validate response value is within expected range (0-3 for most assessments)
    if (response.value < 0 || response.value > 3) {
      return {
        isValid: false,
        error: `Response ${i + 1} has invalid value (must be between 0 and 3)`
      };
    }
  }
  
  return { isValid: true };
}