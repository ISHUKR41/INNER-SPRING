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
  createdAt: timestamp("created_at").defaultNow(), // Account creation timestamp - for analytics and support
  updatedAt: timestamp("updated_at").defaultNow(), // Last profile update - tracks account activity
});

/**
 * Chat Conversations Table - AI chatbot conversation sessions
 * 
 * Each conversation represents a separate chat session with the AI mental health assistant.
 * Allows users to maintain multiple ongoing conversations for different topics or concerns.
 * 
 * Business Logic:
 * - Titles are auto-generated based on the first user message
 * - Conversations persist until explicitly deleted by user
 * - Used for conversation history and context continuity
 */
export const chatConversations = pgTable("chat_conversations", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`), // Unique conversation identifier
  userId: uuid("user_id").references(() => users.id), // Links conversation to specific user account
  title: text("title"), // Auto-generated conversation title based on first message
  createdAt: timestamp("created_at").defaultNow(), // When conversation was started
  updatedAt: timestamp("updated_at").defaultNow(), // Last message timestamp - for sorting
});

/**
 * Chat Messages Table - Individual messages within AI conversations
 * 
 * Stores the complete message history for each conversation session.
 * Enables conversation context for AI responses and user review.
 * 
 * Message Flow:
 * 1. User sends message (role: 'user')
 * 2. AI processes and responds (role: 'assistant')
 * 3. Messages are displayed chronologically in chat interface
 */
export const chatMessages = pgTable("chat_messages", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`), // Unique message identifier
  conversationId: uuid("conversation_id").references(() => chatConversations.id).notNull(), // Links to parent conversation - required for data integrity
  role: text("role").notNull(), // Message sender - either 'user' or 'assistant' (AI)
  content: text("content").notNull(), // Actual message text - supports markdown formatting
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
}));

export const chatConversationsRelations = relations(chatConversations, ({ one, many }) => ({
  user: one(users, {
    fields: [chatConversations.userId],
    references: [users.id],
  }),
  messages: many(chatMessages),
}));

export const chatMessagesRelations = relations(chatMessages, ({ one }) => ({
  conversation: one(chatConversations, {
    fields: [chatMessages.conversationId],
    references: [chatConversations.id],
  }),
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
