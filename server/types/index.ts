/**
 * Server-side Type Definitions
 * 
 * This module defines types that are specific to the server-side application
 * and are not shared with the client. These types help ensure type safety
 * throughout the server codebase and provide clear interfaces for services.
 * 
 * Organization:
 * - API Request/Response types
 * - Service layer types
 * - Configuration types
 * - Error handling types
 * - WebSocket message types
 */

/**
 * API Response wrapper type for consistent response formatting
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  timestamp: string;
}

/**
 * Error response structure for consistent error handling
 */
export interface ErrorResponse {
  success: false;
  error: string;
  message: string;
  statusCode: number;
  timestamp: string;
  details?: any;
}

/**
 * Pagination parameters for list endpoints
 */
export interface PaginationParams {
  page: number;
  limit: number;
  offset: number;
}

/**
 * Paginated response wrapper
 */
export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

/**
 * WebSocket message types for real-time communication
 */
export interface WebSocketMessage {
  type: 'ping' | 'pong' | 'chat_message' | 'connection_established' | 'error' | 'message_saved';
  data?: any;
  timestamp: number;
  id?: string;
}

/**
 * Chat message WebSocket payload
 */
export interface ChatMessagePayload {
  type: 'chat_message';
  conversationId: string;
  role: 'user' | 'assistant';
  content: string;
}

/**
 * OpenAI service configuration
 */
export interface OpenAIConfig {
  apiKey: string;
  model: string;
  maxTokens: number;
  temperature: number;
}

/**
 * OpenAI chat response structure
 */
export interface OpenAIChatResponse {
  message: string;
  suggestions?: string[];
  escalation?: {
    level: 'low' | 'medium' | 'high' | 'crisis';
    reason: string;
    recommendations: string[];
  };
}

/**
 * Assessment analysis result from OpenAI
 */
export interface AssessmentAnalysis {
  interpretation: string;
  recommendations: string[];
  riskLevel: 'low' | 'moderate' | 'high' | 'severe';
  urgency: 'none' | 'low' | 'medium' | 'high' | 'immediate';
}

/**
 * Database connection configuration
 */
export interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  ssl?: boolean;
  maxConnections?: number;
}

/**
 * Server configuration interface
 */
export interface ServerConfig {
  port: number;
  host: string;
  environment: 'development' | 'production' | 'test';
  cors: {
    origin: string[];
    credentials: boolean;
  };
  rateLimit: {
    windowMs: number;
    maxRequests: number;
  };
  session: {
    secret: string;
    maxAge: number;
  };
}

/**
 * Email service configuration for notifications
 */
export interface EmailConfig {
  provider: 'smtp' | 'sendgrid' | 'mailgun';
  apiKey?: string;
  from: string;
  templates: {
    appointmentConfirmation: string;
    appointmentReminder: string;
    emergencyAlert: string;
  };
}

/**
 * File upload configuration
 */
export interface FileUploadConfig {
  maxSize: number; // in bytes
  allowedTypes: string[];
  destination: string;
  publicUrl: string;
}

/**
 * Rate limiting rule definition
 */
export interface RateLimitRule {
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  windowMs: number;
  maxRequests: number;
  message: string;
}

/**
 * Audit log entry for tracking important actions
 */
export interface AuditLogEntry {
  id: string;
  userId?: string;
  action: string;
  resource: string;
  resourceId: string;
  details: Record<string, any>;
  ipAddress: string;
  userAgent: string;
  timestamp: Date;
}

/**
 * Health check result for monitoring
 */
export interface HealthCheckResult {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: Date;
  services: {
    database: {
      status: 'up' | 'down';
      responseTime?: number;
      error?: string;
    };
    openai: {
      status: 'up' | 'down';
      responseTime?: number;
      error?: string;
    };
    websocket: {
      status: 'up' | 'down';
      connections: number;
    };
  };
  uptime: number;
  memory: {
    used: number;
    total: number;
    percentage: number;
  };
}

/**
 * Middleware context for request processing
 */
export interface MiddlewareContext {
  requestId: string;
  userId?: string;
  userRole?: string;
  ipAddress: string;
  userAgent: string;
  startTime: number;
}

/**
 * Crisis detection result for safety monitoring
 */
export interface CrisisDetectionResult {
  hasCrisisIndicators: boolean;
  confidence: number;
  indicators: string[];
  recommendedActions: string[];
  escalationRequired: boolean;
  emergencyContacts?: Array<{
    type: string;
    contact: string;
    description: string;
  }>;
}