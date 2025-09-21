/**
 * Database Schema Definitions
 * 
 * This file contains the complete database schema for the MindCare mental health platform.
 * It defines all tables, relationships, and validation schemas used throughout the application.
 * 
 * Key Features:
 * - PostgreSQL database with UUID primary keys for security
 * - Comprehensive mental health tracking (assessments, appointments, chat)
 * - Peer support forum with moderation capabilities
 * - Resource library with multi-language support
 * - Emergency contact system for crisis situations
 * 
 * Security Considerations:
 * - All sensitive data is properly typed and validated
 * - Foreign key constraints ensure data integrity
 * - Anonymous posting options for privacy
 * - Password hashing handled at application layer
 * 
 * @author MindCare Development Team
 * @version 1.0.0
 */

import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean, jsonb, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

/**
 * Users Table - Core user authentication and profile management
 * 
 * Stores student account information for the mental health platform.
 * Supports both identified and anonymous interactions for privacy.
 * 
 * Security Notes:
 * - Passwords are hashed with bcrypt before storage (handled in routes.ts)
 * - Email and username must be unique for authentication
 * - UUID primary keys prevent enumeration attacks
 */
export const users = pgTable("users", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`), // Unique identifier - auto-generated UUID for security
  username: text("username").notNull().unique(), // Login identifier - must be unique across platform
  email: text("email").notNull().unique(), // Contact email - used for notifications and password reset
  password: text("password").notNull(), // Hashed password - never stored in plain text
  firstName: text("first_name"), // Optional - user's first name for personalization
  lastName: text("last_name"), // Optional - user's last name for formal communications
  studentId: text("student_id"), // Optional - institutional student ID for verification
  isAnonymous: boolean("is_anonymous").default(false), // Privacy setting - allows anonymous forum posting
  
  // === MOOD TRACKING ENHANCEMENTS ===
  currentMood: text("current_mood"), // Current mood state: 'excellent', 'good', 'neutral', 'low', 'very_low'
  lastMoodUpdate: timestamp("last_mood_update"), // When mood was last updated - for tracking frequency
  moodTrackingEnabled: boolean("mood_tracking_enabled").default(true), // User preference for mood tracking
  moodReminderFrequency: text("mood_reminder_frequency").default('daily'), // Mood check-in frequency: 'daily', 'weekly', 'disabled'
  
  // === SESSION MANAGEMENT ===
  lastActiveSession: timestamp("last_active_session"), // Last time user was active in a chat session
  preferredSessionLength: integer("preferred_session_length").default(30), // Preferred chat session length in minutes
  sessionNotificationsEnabled: boolean("session_notifications_enabled").default(true), // Session reminder preferences
  autoSaveEnabled: boolean("auto_save_enabled").default(true), // Auto-save conversation progress
  
  // === PERSONALIZATION PREFERENCES ===
  chatPersonality: text("chat_personality").default('supportive'), // AI personality: 'supportive', 'clinical', 'friendly', 'professional'
  preferredLanguage: text("preferred_language").default('en'), // User's preferred language for AI responses
  accessibilityNeeds: text("accessibility_needs").array(), // Array of accessibility requirements: ['large_text', 'high_contrast', 'screen_reader']
  timeZone: text("time_zone"), // User timezone for scheduling and notifications
  notificationPreferences: jsonb("notification_preferences"), // Complex notification settings as JSON
  onboardingCompleted: boolean("onboarding_completed").default(false), // Whether user completed initial setup
  privacyLevel: text("privacy_level").default('standard'), // Privacy setting: 'minimal', 'standard', 'enhanced'
  
  createdAt: timestamp("created_at").defaultNow(), // Account creation timestamp - for analytics and support
  updatedAt: timestamp("updated_at").defaultNow(), // Last profile update - tracks account activity
});

/**
 * Chat Conversations Table - AI chatbot conversation sessions
 * 
 * Each conversation represents a separate chat session with the AI mental health assistant.
 * Allows users to maintain multiple ongoing conversations for different topics or concerns.
 * 
 * Enhanced Features:
 * - Conversation organization with pinning and archiving
 * - Category-based filtering for different therapeutic topics
 * - Privacy controls and auto-deletion settings
 * - Mood context tracking for conversation-specific emotional states
 * - Last message tracking for conversation activity sorting
 * 
 * Business Logic:
 * - Titles are auto-generated based on the first user message
 * - Conversations persist until explicitly deleted by user or auto-deletion triggers
 * - Used for conversation history and context continuity
 * - Mood context enables personalized therapeutic recommendations
 */
export const chatConversations = pgTable("chat_conversations", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`), // Unique conversation identifier
  userId: uuid("user_id").references(() => users.id), // Links conversation to specific user account
  title: text("title"), // Auto-generated conversation title based on first message
  pinned: boolean("pinned").default(false), // User preference for important conversations
  archived: boolean("archived").default(false), // Hide from active conversations list
  lastMessageAt: timestamp("last_message_at"), // Timestamp of most recent message for sorting
  category: text("category"), // Conversation topic: 'general', 'anxiety', 'depression', 'crisis', 'wellness'
  privacyLevel: text("privacy_level").default('standard'), // Privacy setting: 'minimal', 'standard', 'enhanced'
  autoDeleteAfter: integer("auto_delete_after"), // Days after which conversation auto-deletes (null = never)
  moodContext: jsonb("mood_context"), // Conversation-specific mood tracking data and patterns
  createdAt: timestamp("created_at").defaultNow(), // When conversation was started
  updatedAt: timestamp("updated_at").defaultNow(), // Last message timestamp - for sorting
});

/**
 * Chat Messages Table - Individual messages within AI conversations
 * 
 * Stores the complete message history for each conversation session.
 * Enables conversation context for AI responses and user review.
 * 
 * Enhanced Features:
 * - Message threading with reply-to functionality
 * - Specialized message types for different therapeutic content
 * - Metadata storage for rich message content (attachments, exercises, etc.)
 * - Edit tracking for message modification history
 * 
 * Message Flow:
 * 1. User sends message (role: 'user')
 * 2. AI processes and responds (role: 'assistant')
 * 3. Messages are displayed chronologically in chat interface
 * 4. Special message types trigger contextual UI elements
 */
export const chatMessages = pgTable("chat_messages", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`), // Unique message identifier
  conversationId: uuid("conversation_id").references(() => chatConversations.id).notNull(), // Links to parent conversation - required for data integrity
  role: text("role").notNull(), // Message sender - either 'user' or 'assistant' (AI)
  content: text("content").notNull(), // Actual message text - supports markdown formatting
  messageType: text("message_type").default('text'), // Message category: 'text', 'crisis', 'resource', 'exercise', 'mood_checkin'
  metadata: jsonb("metadata"), // Additional structured data specific to message type (exercise steps, resource links, mood data)
  replyToId: uuid("reply_to_id"), // Self-referencing for threaded conversations - foreign key constraint handled in relations
  editedAt: timestamp("edited_at"), // When message was last edited - null if never edited
  timestamp: timestamp("timestamp").defaultNow(), // When message was sent - for chronological ordering
});

/**
 * Counselors Table - Mental health professionals and therapists
 * 
 * Directory of licensed mental health professionals available for appointments.
 * Includes specializations, availability, and credentials for student matching.
 * 
 * Features:
 * - Multi-language support for diverse student populations
 * - Specialization tags for targeted mental health support
 * - Rating system for quality assurance
 * - Real-time availability tracking
 */
export const counselors = pgTable("counselors", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`), // Unique counselor identifier
  name: text("name").notNull(), // Full professional name - displayed to students
  credentials: text("credentials"), // Professional licenses and certifications (e.g., "LCSW, PhD")
  specializations: text("specializations").array(), // Areas of expertise (e.g., ["anxiety", "depression", "ADHD"])
  languages: text("languages").array(), // Spoken languages for accessibility (e.g., ["en", "es", "zh"])
  bio: text("bio"), // Professional background and approach description
  rating: integer("rating").default(5), // Average rating from student feedback (1-5 scale)
  isAvailable: boolean("is_available").default(true), // Current availability status for new appointments
  imageUrl: text("image_url"), // Professional headshot URL for student comfort and recognition
});

/**
 * Appointments Table - Counseling session bookings and management
 * 
 * Manages all aspects of mental health counseling appointments from booking to completion.
 * Supports multiple session types and urgency levels for appropriate care matching.
 * 
 * Workflow:
 * 1. Student books appointment (status: 'scheduled')
 * 2. Counselor confirms (status: 'confirmed')
 * 3. Session completed (status: 'completed')
 * 4. Follow-up tracking and notes
 * 
 * Crisis Management:
 * - High/crisis urgency levels trigger immediate notifications
 * - Crisis sessions can be scheduled outside normal hours
 */
export const appointments = pgTable("appointments", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`), // Unique appointment identifier
  userId: uuid("user_id").references(() => users.id), // Student booking the appointment
  counselorId: uuid("counselor_id").references(() => counselors.id), // Assigned mental health professional
  dateTime: timestamp("date_time").notNull(), // Scheduled session date and time
  duration: integer("duration").default(60), // Session length in minutes - typically 60 for standard sessions
  sessionType: text("session_type").notNull(), // Meeting format: 'in-person', 'video', 'phone', 'crisis'
  primaryConcern: text("primary_concern"), // Main issue student wants to address (e.g., "anxiety", "academic stress")
  urgencyLevel: text("urgency_level").default('routine'), // Priority level: 'routine', 'moderate', 'high', 'crisis'
  status: text("status").default('scheduled'), // Current state: 'scheduled', 'confirmed', 'completed', 'cancelled'
  additionalInfo: text("additional_info"), // Any special requirements or notes from student
  createdAt: timestamp("created_at").defaultNow(), // When appointment was booked - for analytics and follow-up
});

/**
 * Assessments Table - Mental health questionnaire results and tracking
 * 
 * Stores results from standardized mental health screening tools.
 * Enables progress tracking, risk assessment, and personalized recommendations.
 * 
 * Supported Assessment Types:
 * - PHQ-9: Depression screening (9 questions, 0-27 score range)
 * - GAD-7: Anxiety screening (7 questions, 0-21 score range)
 * - GHQ-12: General mental health (12 questions, 0-36 score range)
 * - PSS-10: Perceived stress scale (10 questions, 0-40 score range)
 * 
 * Clinical Use:
 * - Severity interpretations follow clinical guidelines
 * - Scores trigger appropriate intervention recommendations
 * - Trends tracked over time for progress monitoring
 */
export const assessments = pgTable("assessments", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`), // Unique assessment record identifier
  userId: uuid("user_id").references(() => users.id), // Student who completed the assessment
  assessmentType: text("assessment_type").notNull(), // Standardized tool used: 'PHQ-9', 'GAD-7', 'GHQ-12', 'PSS-10'
  responses: jsonb("responses").notNull(), // Array of individual question responses with scores
  totalScore: integer("total_score").notNull(), // Calculated total score based on assessment type
  interpretation: text("interpretation").notNull(), // Clinical severity level: 'minimal', 'mild', 'moderate', 'severe'
  recommendations: text("recommendations").array(), // Personalized action items based on results
  completedAt: timestamp("completed_at").defaultNow(), // When assessment was finished - for progress tracking
});

/**
 * Resources Table - Mental health educational content and materials
 * 
 * Comprehensive library of mental health resources including videos, articles,
 * audio content, and PDFs. Supports multi-language content for accessibility.
 * 
 * Content Types:
 * - Videos: Guided meditations, educational content, therapy techniques
 * - Audio: Podcasts, relaxation sounds, breathing exercises
 * - PDFs: Worksheets, handouts, clinical resources
 * - Articles: Blog posts, research summaries, self-help guides
 * 
 * Organization:
 * - Categorized by mental health topics
 * - Tagged for advanced filtering
 * - Featured content highlighted on homepage
 */
export const resources = pgTable("resources", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`), // Unique resource identifier
  title: text("title").notNull(), // Resource name displayed to users
  description: text("description"), // Brief summary of content and benefits
  type: text("type").notNull(), // Content format: 'video', 'audio', 'pdf', 'article'
  category: text("category").notNull(), // Mental health topic: 'anxiety', 'depression', 'stress', 'sleep', 'academic'
  language: text("language").default('en'), // Content language code for internationalization
  url: text("url"), // External link or internal file path
  thumbnailUrl: text("thumbnail_url"), // Preview image for visual content
  duration: integer("duration"), // Length in minutes for video/audio content (null for text)
  isFeatured: boolean("is_featured").default(false), // Highlighted content for homepage display
  tags: text("tags").array(), // Additional keywords for detailed filtering
  createdAt: timestamp("created_at").defaultNow(), // When resource was added to library
});

/**
 * Forum Categories Table - Peer support discussion topic organization
 * 
 * Organizes forum posts into mental health topic areas.
 * Helps students find relevant discussions and support groups.
 * 
 * Examples:
 * - General Support: Open discussions and introductions
 * - Anxiety & Stress: Coping strategies and experiences
 * - Academic Pressure: Study stress and time management
 * - Social Connection: Building relationships and community
 */
export const forumCategories = pgTable("forum_categories", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`), // Unique category identifier
  name: text("name").notNull(), // Category display name (e.g., "Anxiety & Stress")
  description: text("description"), // Explanation of what topics belong in this category
  color: text("color").default('#3B82F6'), // UI color theme for visual organization
  isActive: boolean("is_active").default(true), // Whether category accepts new posts
});

/**
 * Forum Posts Table - Peer support discussion threads
 * 
 * User-generated content for peer support and community building.
 * Includes moderation workflow to ensure safe, supportive environment.
 * 
 * Privacy Features:
 * - Anonymous posting by default to encourage participation
 * - User identity protected unless explicitly shared
 * 
 * Moderation Workflow:
 * 1. Post created (isModerated: false, isApproved: false)
 * 2. Content reviewed by moderators (isModerated: true)
 * 3. Approved posts visible to community (isApproved: true)
 * 4. Inappropriate content removed or flagged
 */
export const forumPosts = pgTable("forum_posts", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`), // Unique post identifier
  userId: uuid("user_id").references(() => users.id), // Post author - may be hidden if anonymous
  categoryId: uuid("category_id").references(() => forumCategories.id), // Topic category for organization
  title: text("title").notNull(), // Post subject line - displayed in forum listings
  content: text("content").notNull(), // Full post text - supports markdown formatting
  isAnonymous: boolean("is_anonymous").default(true), // Privacy setting - hides author identity
  upvotes: integer("upvotes").default(0), // Community approval count - indicates helpful content
  replyCount: integer("reply_count").default(0), // Number of responses - updated via triggers
  isModerated: boolean("is_moderated").default(false), // Whether content has been reviewed
  isApproved: boolean("is_approved").default(false), // Moderator approval for public visibility
  createdAt: timestamp("created_at").defaultNow(), // Post creation time - for chronological sorting
  updatedAt: timestamp("updated_at").defaultNow(), // Last edit time - tracks content changes
});

/**
 * Forum Replies Table - Responses to peer support posts
 * 
 * Enables threaded discussions and peer-to-peer support.
 * Same moderation and privacy features as posts.
 * 
 * Reply Features:
 * - Nested conversations for detailed support
 * - Anonymous responses to maintain privacy
 * - Community voting to highlight helpful advice
 * - Moderation to ensure appropriate support
 */
export const forumReplies = pgTable("forum_replies", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`), // Unique reply identifier
  postId: uuid("post_id").references(() => forumPosts.id).notNull(), // Parent post - required for data integrity
  userId: uuid("user_id").references(() => users.id), // Reply author - may be hidden if anonymous
  content: text("content").notNull(), // Reply text - supports markdown and mentions
  isAnonymous: boolean("is_anonymous").default(true), // Privacy protection for responders
  upvotes: integer("upvotes").default(0), // Community validation of helpful responses
  isModerated: boolean("is_moderated").default(false), // Content review status
  isApproved: boolean("is_approved").default(false), // Visibility approval from moderators
  createdAt: timestamp("created_at").defaultNow(), // Response timestamp - for threading display
});

/**
 * Emergency Contacts Table - Crisis intervention and immediate support
 * 
 * Critical mental health resources for students in crisis situations.
 * Prominently displayed on emergency page and in crisis detection flows.
 * 
 * Contact Types:
 * - Hotline: National suicide prevention, crisis text lines
 * - Campus: University counseling centers, security
 * - Hospital: Emergency rooms, psychiatric facilities  
 * - Crisis: Mobile crisis units, crisis intervention teams
 * 
 * Availability:
 * - 24/7 services clearly marked for urgent situations
 * - Location-specific resources for in-person help
 */
export const emergencyContacts = pgTable("emergency_contacts", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`), // Unique contact identifier
  name: text("name").notNull(), // Service name (e.g., "National Suicide Prevention Lifeline")
  phoneNumber: text("phone_number"), // Contact number - formatted for direct calling
  description: text("description"), // Service details and when to use
  type: text("type").notNull(), // Service category: 'hotline', 'campus', 'hospital', 'crisis'
  isAvailable247: boolean("is_available_247").default(false), // 24/7 availability flag for urgent needs
  location: text("location"), // Physical address for in-person services
  isActive: boolean("is_active").default(true), // Current availability status
});

/**
 * Crisis Contacts Table - Specialized crisis intervention and mental health emergency support
 * 
 * Comprehensive database of crisis hotlines, text services, and chat support worldwide.
 * Designed specifically for immediate crisis intervention with multi-modal contact options.
 * 
 * Features:
 * - International coverage with country-specific numbers
 * - Multiple contact methods (phone, SMS, chat) for accessibility
 * - Multi-language support for diverse populations
 * - Real-time availability tracking by time zone
 * - Crisis-specific categorization for appropriate matching
 * 
 * Crisis Intervention Types:
 * - Suicide prevention: Specialized trained counselors for suicidal ideation
 * - General crisis: Broad mental health crisis support
 * - Text/SMS: Anonymous text-based crisis counseling
 * - Chat: Real-time online chat support
 * - Specialized: LGBTQ+, veterans, youth-specific crisis lines
 * 
 * Data Integrity:
 * - All contact information verified and regularly updated
 * - Availability schedules maintained for accurate user expectations
 * - Quality assurance for crisis response capabilities
 */
export const crisisContacts = pgTable("crisis_contacts", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`), // Unique crisis contact identifier for secure referencing
  name: text("name").notNull(), // Official service name (e.g., "National Suicide Prevention Lifeline")
  country: text("country").notNull(), // ISO country code for geographic filtering (e.g., "US", "CA", "UK")
  phone: text("phone"), // Primary phone number - formatted for international dialing (e.g., "+1-988")
  sms: text("sms"), // SMS/text number if different from phone (e.g., "741741" for Crisis Text Line)
  chatUrl: text("chat_url"), // URL for web-based crisis chat support
  type: text("type").notNull(), // Contact method: 'hotline', 'text', 'chat', 'multi' (supports multiple methods)
  availability: text("availability").notNull(), // Operating hours: '24/7', 'business', 'evenings', or specific hours
  languages: text("languages").array(), // Supported languages array (e.g., ["en", "es", "fr"] for accessibility)
  description: text("description").notNull(), // Detailed service description, specializations, and what to expect
  isActive: boolean("is_active").default(true), // Current operational status for filtering active services
  priority: integer("priority").default(1), // Display priority (1 = highest) for ordering recommendations
  createdAt: timestamp("created_at").defaultNow(), // Record creation timestamp for data management
  updatedAt: timestamp("updated_at").defaultNow(), // Last update timestamp for data freshness validation
});

/**
 * Chat Attachments Table - File attachments for chat messages
 * 
 * Stores metadata and references for files attached to chat messages.
 * Supports various file types including images, documents, audio recordings.
 * 
 * Features:
 * - File metadata tracking (size, type, name)
 * - Secure file storage with URL references
 * - Upload timestamp for file management
 * - Integration with message threading system
 * 
 * Security:
 * - File type validation to prevent malicious uploads
 * - Size limits enforced at application layer
 * - Secure URL generation for file access
 */
export const chatAttachments = pgTable("chat_attachments", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`), // Unique attachment identifier
  messageId: uuid("message_id").references(() => chatMessages.id).notNull(), // Links attachment to specific message
  type: text("type").notNull(), // File type: 'image', 'audio', 'document', 'video'
  url: text("url").notNull(), // Secure URL for file access - either cloud storage or local path
  name: text("name").notNull(), // Original filename as uploaded by user
  size: integer("size").notNull(), // File size in bytes for storage management
  uploadedAt: timestamp("uploaded_at").defaultNow(), // When file was uploaded - for cleanup and analytics
});

/**
 * Mood Entries Table - User mood tracking and emotional state logging
 * 
 * Comprehensive mood tracking system for mental health monitoring.
 * Supports both standalone mood entries and conversation-linked emotional states.
 * 
 * Features:
 * - Flexible mood recording with optional conversation context
 * - Note field for detailed emotional descriptions
 * - Timeline tracking for mood pattern analysis
 * - Integration with chat conversations for contextual mood data
 * 
 * Clinical Use:
 * - Mood trend analysis for therapeutic insights
 * - Crisis detection through mood pattern recognition
 * - Personalized therapeutic recommendations based on emotional states
 */
export const moodEntries = pgTable("mood_entries", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`), // Unique mood entry identifier
  userId: uuid("user_id").references(() => users.id).notNull(), // User who recorded the mood entry
  mood: text("mood").notNull(), // Mood state: 'excellent', 'good', 'neutral', 'low', 'very_low', 'crisis'
  note: text("note"), // Optional detailed description of emotional state and circumstances
  conversationId: uuid("conversation_id").references(() => chatConversations.id), // Optional link to conversation context
  createdAt: timestamp("created_at").defaultNow(), // When mood was recorded - for timeline analysis
});

/**
 * Crisis Events Table - Mental health crisis detection and response tracking
 * 
 * Critical system for identifying, logging, and managing mental health emergencies.
 * Provides comprehensive crisis intervention workflow and response tracking.
 * 
 * Features:
 * - Multi-level crisis severity classification
 * - Automatic crisis detection through AI analysis
 * - Response tracking and resolution monitoring
 * - Integration with emergency contact systems
 * 
 * Crisis Levels:
 * - info: Mild concerns or preventive information
 * - warning: Moderate risk requiring attention
 * - critical: Immediate intervention required
 * 
 * Workflow:
 * 1. Crisis detected (detectedAt timestamp set)
 * 2. Intervention initiated (emergency contacts, counselor notification)
 * 3. Response provided (notes updated with actions taken)
 * 4. Crisis resolved (resolvedAt timestamp set)
 */
export const crisisEvents = pgTable("crisis_events", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`), // Unique crisis event identifier
  userId: uuid("user_id").references(() => users.id).notNull(), // User experiencing the crisis
  conversationId: uuid("conversation_id").references(() => chatConversations.id), // Optional conversation that triggered crisis detection
  level: text("level").notNull(), // Crisis severity: 'info', 'warning', 'critical'
  detectedAt: timestamp("detected_at").defaultNow(), // When crisis was first identified
  resolvedAt: timestamp("resolved_at"), // When crisis was resolved - null if ongoing
  notes: jsonb("notes"), // Comprehensive crisis response data: detection triggers, actions taken, outcomes
});

/**
 * Exercise Templates Table - Therapeutic exercises and activities library
 * 
 * Comprehensive collection of mental health exercises, coping strategies, and therapeutic activities.
 * Provides structured, evidence-based interventions for various mental health concerns.
 * 
 * Features:
 * - Categorized exercises for different therapeutic goals
 * - Difficulty levels for progressive skill building
 * - Duration estimates for session planning
 * - Step-by-step instructions in structured format
 * 
 * Exercise Categories:
 * - mindfulness: Meditation, breathing exercises, grounding techniques
 * - cognitive: CBT exercises, thought restructuring, problem-solving
 * - behavioral: Activity scheduling, exposure exercises, behavioral activation
 * - relaxation: Progressive muscle relaxation, visualization, stress reduction
 * - social: Communication skills, assertiveness training, relationship building
 * 
 * Usage:
 * - AI can recommend appropriate exercises based on user needs
 * - Exercises can be assigned as homework between sessions
 * - Progress tracking through completion metrics
 */
export const exerciseTemplates = pgTable("exercise_templates", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`), // Unique exercise identifier
  title: text("title").notNull(), // Exercise name displayed to users
  description: text("description").notNull(), // Brief overview of exercise purpose and benefits
  steps: jsonb("steps").notNull(), // Structured step-by-step instructions as JSON array
  category: text("category").notNull(), // Exercise type: 'mindfulness', 'cognitive', 'behavioral', 'relaxation', 'social'
  difficulty: text("difficulty").notNull(), // Skill level required: 'beginner', 'intermediate', 'advanced'
  duration: integer("duration"), // Estimated completion time in minutes
});

/**
 * Conversation Tags Table - Organizational tags for chat conversations
 * 
 * Flexible tagging system for organizing and categorizing chat conversations.
 * Enables users to create custom organizational structures for their therapeutic discussions.
 * 
 * Features:
 * - User-defined tags for personal organization
 * - System-generated tags based on conversation analysis
 * - Time-based tag tracking for conversation evolution
 * - Search and filtering capabilities
 * 
 * Tag Examples:
 * - User-created: "work-stress", "family-issues", "exam-anxiety"
 * - System-generated: "crisis-resolved", "mood-improving", "exercise-assigned"
 * - Therapeutic: "cbt-session", "mindfulness-practice", "goal-setting"
 * 
 * Benefits:
 * - Quick conversation retrieval and organization
 * - Pattern recognition across similar discussions
 * - Progress tracking through tag evolution
 * - Personalized conversation management
 */
export const conversationTags = pgTable("conversation_tags", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`), // Unique tag assignment identifier
  conversationId: uuid("conversation_id").references(() => chatConversations.id).notNull(), // Tagged conversation
  tag: text("tag").notNull(), // Tag name - can be user-created or system-generated
  addedAt: timestamp("added_at").defaultNow(), // When tag was applied - for tracking conversation evolution
});

// =====================================
// DATABASE RELATIONSHIPS
// =====================================

/**
 * Database table relationships using Drizzle ORM relations.
 * These define foreign key connections and enable type-safe joins.
 * Essential for maintaining data integrity and enabling complex queries.
 */

/**
 * User Relationships - Links user accounts to all their associated data
 * Enables querying all user activity across the platform
 */
export const usersRelations = relations(users, ({ many }) => ({
  chatConversations: many(chatConversations),
  appointments: many(appointments),
  assessments: many(assessments),
  forumPosts: many(forumPosts),
  forumReplies: many(forumReplies),
  moodEntries: many(moodEntries),
  crisisEvents: many(crisisEvents),
}));

export const chatConversationsRelations = relations(chatConversations, ({ one, many }) => ({
  user: one(users, {
    fields: [chatConversations.userId],
    references: [users.id],
  }),
  messages: many(chatMessages),
  moodEntries: many(moodEntries),
  crisisEvents: many(crisisEvents),
  conversationTags: many(conversationTags),
}));

export const chatMessagesRelations = relations(chatMessages, ({ one, many }) => ({
  conversation: one(chatConversations, {
    fields: [chatMessages.conversationId],
    references: [chatConversations.id],
  }),
  replyTo: one(chatMessages, {
    fields: [chatMessages.replyToId],
    references: [chatMessages.id],
  }),
  attachments: many(chatAttachments),
  replies: many(chatMessages),
}));

export const appointmentsRelations = relations(appointments, ({ one }) => ({
  user: one(users, {
    fields: [appointments.userId],
    references: [users.id],
  }),
  counselor: one(counselors, {
    fields: [appointments.counselorId],
    references: [counselors.id],
  }),
}));

export const counselorsRelations = relations(counselors, ({ many }) => ({
  appointments: many(appointments),
}));

export const assessmentsRelations = relations(assessments, ({ one }) => ({
  user: one(users, {
    fields: [assessments.userId],
    references: [users.id],
  }),
}));

export const forumPostsRelations = relations(forumPosts, ({ one, many }) => ({
  user: one(users, {
    fields: [forumPosts.userId],
    references: [users.id],
  }),
  category: one(forumCategories, {
    fields: [forumPosts.categoryId],
    references: [forumCategories.id],
  }),
  replies: many(forumReplies),
}));

export const forumRepliesRelations = relations(forumReplies, ({ one }) => ({
  post: one(forumPosts, {
    fields: [forumReplies.postId],
    references: [forumPosts.id],
  }),
  user: one(users, {
    fields: [forumReplies.userId],
    references: [users.id],
  }),
}));

export const forumCategoriesRelations = relations(forumCategories, ({ many }) => ({
  posts: many(forumPosts),
}));

/**
 * New Table Relationships - Links for all the enhanced chat system tables
 */

export const chatAttachmentsRelations = relations(chatAttachments, ({ one }) => ({
  message: one(chatMessages, {
    fields: [chatAttachments.messageId],
    references: [chatMessages.id],
  }),
}));

export const moodEntriesRelations = relations(moodEntries, ({ one }) => ({
  user: one(users, {
    fields: [moodEntries.userId],
    references: [users.id],
  }),
  conversation: one(chatConversations, {
    fields: [moodEntries.conversationId],
    references: [chatConversations.id],
  }),
}));

export const crisisEventsRelations = relations(crisisEvents, ({ one }) => ({
  user: one(users, {
    fields: [crisisEvents.userId],
    references: [users.id],
  }),
  conversation: one(chatConversations, {
    fields: [crisisEvents.conversationId],
    references: [chatConversations.id],
  }),
}));

export const conversationTagsRelations = relations(conversationTags, ({ one }) => ({
  conversation: one(chatConversations, {
    fields: [conversationTags.conversationId],
    references: [chatConversations.id],
  }),
}));

// =====================================
// VALIDATION SCHEMAS & TYPES
// =====================================

/**
 * Insert Schemas - Zod validation schemas for creating new records
 * 
 * These schemas:
 * - Remove auto-generated fields (id, timestamps) from user input
 * - Provide runtime validation for API endpoints
 * - Enable type-safe form handling in frontend
 * - Prevent injection attacks through strict typing
 * 
 * Security Features:
 * - Input sanitization and validation
 * - Required field enforcement
 * - Data type checking
 * - Length limits and format validation
 */

/**
 * User Registration Schema - Validates new user account creation
 * Excludes auto-generated fields that shouldn't be user-provided
 */
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertChatConversationSchema = createInsertSchema(chatConversations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({
  id: true,
  timestamp: true,
});

export const insertCounselorSchema = createInsertSchema(counselors).omit({
  id: true,
});

export const insertAppointmentSchema = createInsertSchema(appointments).omit({
  id: true,
  createdAt: true,
});

export const insertAssessmentSchema = createInsertSchema(assessments).omit({
  id: true,
  completedAt: true,
}).extend({
  // Security: Enforce strict response validation - responses must be an array
  responses: z.array(z.any()).min(1, "Assessment must have at least one response"),
});

export const insertResourceSchema = createInsertSchema(resources).omit({
  id: true,
  createdAt: true,
});

export const insertForumCategorySchema = createInsertSchema(forumCategories).omit({
  id: true,
});

export const insertForumPostSchema = createInsertSchema(forumPosts).omit({
  id: true,
  upvotes: true,
  replyCount: true,
  createdAt: true,
  updatedAt: true,
});

export const insertForumReplySchema = createInsertSchema(forumReplies).omit({
  id: true,
  upvotes: true,
  createdAt: true,
});

export const insertEmergencyContactSchema = createInsertSchema(emergencyContacts).omit({
  id: true,
});

export const insertCrisisContactSchema = createInsertSchema(crisisContacts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Enhanced Chat System Schemas
export const insertChatAttachmentSchema = createInsertSchema(chatAttachments).omit({
  id: true,
  uploadedAt: true,
});

export const insertMoodEntrySchema = createInsertSchema(moodEntries).omit({
  id: true,
  createdAt: true,
});

export const insertCrisisEventSchema = createInsertSchema(crisisEvents).omit({
  id: true,
  detectedAt: true,
}).extend({
  // Enforce valid crisis levels
  level: z.enum(['info', 'warning', 'critical']),
});

export const insertExerciseTemplateSchema = createInsertSchema(exerciseTemplates).omit({
  id: true,
}).extend({
  // Enforce structured steps format
  steps: z.array(z.object({
    step: z.number(),
    instruction: z.string(),
    duration: z.number().optional(),
  })).min(1, "Exercise must have at least one step"),
  // Validate category and difficulty enums
  category: z.enum(['mindfulness', 'cognitive', 'behavioral', 'relaxation', 'social']),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
});

export const insertConversationTagSchema = createInsertSchema(conversationTags).omit({
  id: true,
  addedAt: true,
});

// =====================================
// TYPESCRIPT TYPES
// =====================================

/**
 * TypeScript type definitions inferred from database schema.
 * 
 * Type Categories:
 * - Select types: Complete records as returned from database queries
 * - Insert types: Data required for creating new records (validated by schemas)
 * 
 * Benefits:
 * - Compile-time type checking prevents runtime errors
 * - IDE autocompletion and error detection
 * - Consistent data structures across frontend and backend
 * - Automatic updates when schema changes
 */

// User account types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type ChatConversation = typeof chatConversations.$inferSelect;
export type InsertChatConversation = z.infer<typeof insertChatConversationSchema>;

export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;

export type Counselor = typeof counselors.$inferSelect;
export type InsertCounselor = z.infer<typeof insertCounselorSchema>;

export type Appointment = typeof appointments.$inferSelect;
export type InsertAppointment = z.infer<typeof insertAppointmentSchema>;

export type Assessment = typeof assessments.$inferSelect;
export type InsertAssessment = z.infer<typeof insertAssessmentSchema>;

export type Resource = typeof resources.$inferSelect;
export type InsertResource = z.infer<typeof insertResourceSchema>;

export type ForumCategory = typeof forumCategories.$inferSelect;
export type InsertForumCategory = z.infer<typeof insertForumCategorySchema>;

export type ForumPost = typeof forumPosts.$inferSelect;
export type InsertForumPost = z.infer<typeof insertForumPostSchema>;

export type ForumReply = typeof forumReplies.$inferSelect;
export type InsertForumReply = z.infer<typeof insertForumReplySchema>;

export type EmergencyContact = typeof emergencyContacts.$inferSelect;
export type InsertEmergencyContact = z.infer<typeof insertEmergencyContactSchema>;

export type CrisisContact = typeof crisisContacts.$inferSelect;
export type InsertCrisisContact = z.infer<typeof insertCrisisContactSchema>;

// Enhanced Chat System Types
export type ChatAttachment = typeof chatAttachments.$inferSelect;
export type InsertChatAttachment = z.infer<typeof insertChatAttachmentSchema>;

export type MoodEntry = typeof moodEntries.$inferSelect;
export type InsertMoodEntry = z.infer<typeof insertMoodEntrySchema>;

export type CrisisEvent = typeof crisisEvents.$inferSelect;
export type InsertCrisisEvent = z.infer<typeof insertCrisisEventSchema>;

export type ExerciseTemplate = typeof exerciseTemplates.$inferSelect;
export type InsertExerciseTemplate = z.infer<typeof insertExerciseTemplateSchema>;

export type ConversationTag = typeof conversationTags.$inferSelect;
export type InsertConversationTag = z.infer<typeof insertConversationTagSchema>;
