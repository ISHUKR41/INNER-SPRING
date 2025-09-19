import { 
  users, chatConversations, chatMessages, counselors, appointments, 
  assessments, resources, forumCategories, forumPosts, forumReplies, 
  emergencyContacts,
  type User, type InsertUser, type ChatConversation, type InsertChatConversation,
  type ChatMessage, type InsertChatMessage, type Counselor, type InsertCounselor,
  type Appointment, type InsertAppointment, type Assessment, type InsertAssessment,
  type Resource, type InsertResource, type ForumCategory, type InsertForumCategory,
  type ForumPost, type InsertForumPost, type ForumReply, type InsertForumReply,
  type EmergencyContact, type InsertEmergencyContact
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, gte, lte, like, sql } from "drizzle-orm";

export interface IStorage {
  // User management
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User | undefined>;

  // Chat functionality
  createChatConversation(conversation: InsertChatConversation): Promise<ChatConversation>;
  getChatConversations(userId: string): Promise<ChatConversation[]>;
  getChatMessages(conversationId: string): Promise<ChatMessage[]>;
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  updateConversationTitle(id: string, title: string): Promise<void>;

  // Counselors
  getCounselors(): Promise<Counselor[]>;
  getCounselor(id: string): Promise<Counselor | undefined>;
  createCounselor(counselor: InsertCounselor): Promise<Counselor>;
  getAvailableCounselors(): Promise<Counselor[]>;

  // Appointments
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  getAppointments(userId: string): Promise<Appointment[]>;
  getAppointment(id: string): Promise<Appointment | undefined>;
  updateAppointment(id: string, updates: Partial<Appointment>): Promise<Appointment | undefined>;
  getAppointmentsByDateRange(counselorId: string, startDate: Date, endDate: Date): Promise<Appointment[]>;
  cancelAppointment(id: string): Promise<void>;

  // Assessments
  createAssessment(assessment: InsertAssessment): Promise<Assessment>;
  getAssessments(userId: string): Promise<Assessment[]>;
  getLatestAssessment(userId: string, type: string): Promise<Assessment | undefined>;

  // Resources
  getResources(category?: string, type?: string, language?: string): Promise<Resource[]>;
  getResource(id: string): Promise<Resource | undefined>;
  getFeaturedResources(): Promise<Resource[]>;
  createResource(resource: InsertResource): Promise<Resource>;
  searchResources(query: string): Promise<Resource[]>;

  // Forum
  getForumCategories(): Promise<ForumCategory[]>;
  createForumCategory(category: InsertForumCategory): Promise<ForumCategory>;
  getForumPosts(categoryId?: string, limit?: number): Promise<ForumPost[]>;
  getForumPost(id: string): Promise<ForumPost | undefined>;
  createForumPost(post: InsertForumPost): Promise<ForumPost>;
  getForumReplies(postId: string): Promise<ForumReply[]>;
  createForumReply(reply: InsertForumReply): Promise<ForumReply>;
  upvotePost(postId: string): Promise<void>;
  upvoteReply(replyId: string): Promise<void>;

  // Emergency contacts
  getEmergencyContacts(): Promise<EmergencyContact[]>;
  createEmergencyContact(contact: InsertEmergencyContact): Promise<EmergencyContact>;
}

export class DatabaseStorage implements IStorage {
  // User management
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user || undefined;
  }

  // Chat functionality
  async createChatConversation(conversation: InsertChatConversation): Promise<ChatConversation> {
    const [conv] = await db.insert(chatConversations).values(conversation).returning();
    return conv;
  }

  async getChatConversations(userId: string): Promise<ChatConversation[]> {
    return await db
      .select()
      .from(chatConversations)
      .where(eq(chatConversations.userId, userId))
      .orderBy(desc(chatConversations.updatedAt));
  }

  async getChatMessages(conversationId: string): Promise<ChatMessage[]> {
    return await db
      .select()
      .from(chatMessages)
      .where(eq(chatMessages.conversationId, conversationId))
      .orderBy(chatMessages.timestamp);
  }

  async createChatMessage(message: InsertChatMessage): Promise<ChatMessage> {
    // Security: Validate foreign key exists before any database operations
    if (!message.conversationId) {
      throw new Error("Conversation ID is required for chat messages");
    }
    
    // Security: Verify conversation exists before creating message
    const conversation = await db
      .select({ id: chatConversations.id })
      .from(chatConversations)
      .where(eq(chatConversations.id, message.conversationId))
      .limit(1);
    
    if (conversation.length === 0) {
      throw new Error("Invalid conversation ID: conversation does not exist");
    }
    
    const [msg] = await db.insert(chatMessages).values(message).returning();
    
    // Update conversation timestamp - no unsafe type assertion needed
    await db
      .update(chatConversations)
      .set({ updatedAt: new Date() })
      .where(eq(chatConversations.id, message.conversationId));
    
    return msg;
  }

  async updateConversationTitle(id: string, title: string): Promise<void> {
    await db
      .update(chatConversations)
      .set({ title, updatedAt: new Date() })
      .where(eq(chatConversations.id, id));
  }

  // Counselors
  async getCounselors(): Promise<Counselor[]> {
    return await db.select().from(counselors).where(eq(counselors.isAvailable, true));
  }

  async getCounselor(id: string): Promise<Counselor | undefined> {
    const [counselor] = await db.select().from(counselors).where(eq(counselors.id, id));
    return counselor || undefined;
  }

  async createCounselor(counselor: InsertCounselor): Promise<Counselor> {
    const [newCounselor] = await db.insert(counselors).values(counselor).returning();
    return newCounselor;
  }

  async getAvailableCounselors(): Promise<Counselor[]> {
    return await db
      .select()
      .from(counselors)
      .where(eq(counselors.isAvailable, true));
  }

  // Appointments
  async createAppointment(appointment: InsertAppointment): Promise<Appointment> {
    // Security: Validate foreign keys exist before database operations
    if (!appointment.userId) {
      throw new Error("User ID is required for appointments");
    }
    
    if (!appointment.counselorId) {
      throw new Error("Counselor ID is required for appointments");
    }
    
    // Security: Verify user exists
    const user = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.id, appointment.userId))
      .limit(1);
    
    if (user.length === 0) {
      throw new Error("Invalid user ID: user does not exist");
    }
    
    // Security: Verify counselor exists and is available
    const counselor = await db
      .select({ id: counselors.id, isAvailable: counselors.isAvailable })
      .from(counselors)
      .where(eq(counselors.id, appointment.counselorId))
      .limit(1);
    
    if (counselor.length === 0) {
      throw new Error("Invalid counselor ID: counselor does not exist");
    }
    
    if (!counselor[0].isAvailable) {
      throw new Error("Counselor is not available for appointments");
    }
    
    const [newAppointment] = await db.insert(appointments).values(appointment).returning();
    return newAppointment;
  }

  async getAppointments(userId: string): Promise<Appointment[]> {
    return await db
      .select()
      .from(appointments)
      .where(eq(appointments.userId, userId))
      .orderBy(desc(appointments.dateTime));
  }

  async getAppointment(id: string): Promise<Appointment | undefined> {
    const [appointment] = await db.select().from(appointments).where(eq(appointments.id, id));
    return appointment || undefined;
  }

  async updateAppointment(id: string, updates: Partial<Appointment>): Promise<Appointment | undefined> {
    const [appointment] = await db
      .update(appointments)
      .set(updates)
      .where(eq(appointments.id, id))
      .returning();
    return appointment || undefined;
  }

  async getAppointmentsByDateRange(counselorId: string, startDate: Date, endDate: Date): Promise<Appointment[]> {
    return await db
      .select()
      .from(appointments)
      .where(
        and(
          eq(appointments.counselorId, counselorId),
          gte(appointments.dateTime, startDate),
          lte(appointments.dateTime, endDate)
        )
      );
  }

  async cancelAppointment(id: string): Promise<void> {
    await db
      .update(appointments)
      .set({ status: 'cancelled' })
      .where(eq(appointments.id, id));
  }

  // Assessments
  async createAssessment(assessment: InsertAssessment): Promise<Assessment> {
    const [newAssessment] = await db.insert(assessments).values(assessment).returning();
    return newAssessment;
  }

  async getAssessments(userId: string): Promise<Assessment[]> {
    return await db
      .select()
      .from(assessments)
      .where(eq(assessments.userId, userId))
      .orderBy(desc(assessments.completedAt));
  }

  async getLatestAssessment(userId: string, type: string): Promise<Assessment | undefined> {
    const [assessment] = await db
      .select()
      .from(assessments)
      .where(and(eq(assessments.userId, userId), eq(assessments.assessmentType, type)))
      .orderBy(desc(assessments.completedAt))
      .limit(1);
    return assessment || undefined;
  }

  // Resources
  async getResources(category?: string, type?: string, language?: string): Promise<Resource[]> {
    // Build conditions array for filtering resources based on optional parameters
    const conditions = [];
    if (category) conditions.push(eq(resources.category, category));
    if (type) conditions.push(eq(resources.type, type));
    if (language) conditions.push(eq(resources.language, language));
    
    // Use a single query construction to maintain proper Drizzle ORM typing
    // This avoids PgSelectBase type issues that occur with conditional query building
    if (conditions.length > 0) {
      return await db
        .select()
        .from(resources)
        .where(and(...conditions))
        .orderBy(desc(resources.createdAt));
    } else {
      return await db
        .select()
        .from(resources)
        .orderBy(desc(resources.createdAt));
    }
  }

  async getResource(id: string): Promise<Resource | undefined> {
    const [resource] = await db.select().from(resources).where(eq(resources.id, id));
    return resource || undefined;
  }

  async getFeaturedResources(): Promise<Resource[]> {
    return await db
      .select()
      .from(resources)
      .where(eq(resources.isFeatured, true))
      .limit(6);
  }

  async createResource(resource: InsertResource): Promise<Resource> {
    const [newResource] = await db.insert(resources).values(resource).returning();
    return newResource;
  }

  async searchResources(query: string): Promise<Resource[]> {
    return await db
      .select()
      .from(resources)
      .where(
        sql`${resources.title} ILIKE ${`%${query}%`} OR ${resources.description} ILIKE ${`%${query}%`}`
      );
  }

  // Forum
  async getForumCategories(): Promise<ForumCategory[]> {
    return await db
      .select()
      .from(forumCategories)
      .where(eq(forumCategories.isActive, true));
  }

  async createForumCategory(category: InsertForumCategory): Promise<ForumCategory> {
    const [newCategory] = await db.insert(forumCategories).values(category).returning();
    return newCategory;
  }

  async getForumPosts(categoryId?: string, limit = 20): Promise<ForumPost[]> {
    // Use separate query constructions to maintain proper Drizzle ORM typing
    // This avoids query builder type issues when conditionally adding where clauses
    if (categoryId) {
      // When categoryId is provided, filter by both approval status and category
      return await db
        .select()
        .from(forumPosts)
        .where(and(eq(forumPosts.isApproved, true), eq(forumPosts.categoryId, categoryId)))
        .orderBy(desc(forumPosts.createdAt))
        .limit(limit);
    } else {
      // When no categoryId, only filter by approval status
      return await db
        .select()
        .from(forumPosts)
        .where(eq(forumPosts.isApproved, true))
        .orderBy(desc(forumPosts.createdAt))
        .limit(limit);
    }
  }

  async getForumPost(id: string): Promise<ForumPost | undefined> {
    const [post] = await db.select().from(forumPosts).where(eq(forumPosts.id, id));
    return post || undefined;
  }

  async createForumPost(post: InsertForumPost): Promise<ForumPost> {
    const [newPost] = await db.insert(forumPosts).values(post).returning();
    return newPost;
  }

  async getForumReplies(postId: string): Promise<ForumReply[]> {
    return await db
      .select()
      .from(forumReplies)
      .where(and(eq(forumReplies.postId, postId), eq(forumReplies.isApproved, true)))
      .orderBy(forumReplies.createdAt);
  }

  async createForumReply(reply: InsertForumReply): Promise<ForumReply> {
    // Security: Validate foreign key exists before any database operations
    if (!reply.postId) {
      throw new Error("Post ID is required for forum replies");
    }
    
    // Security: Verify post exists before creating reply
    const post = await db
      .select({ id: forumPosts.id })
      .from(forumPosts)
      .where(eq(forumPosts.id, reply.postId))
      .limit(1);
    
    if (post.length === 0) {
      throw new Error("Invalid post ID: forum post does not exist");
    }
    
    const [newReply] = await db.insert(forumReplies).values(reply).returning();
    
    // Update post reply count - no unsafe type assertion needed
    await db
      .update(forumPosts)
      .set({ 
        replyCount: sql`${forumPosts.replyCount} + 1`,
        updatedAt: new Date()
      })
      .where(eq(forumPosts.id, reply.postId));
    
    return newReply;
  }

  async upvotePost(postId: string): Promise<void> {
    await db
      .update(forumPosts)
      .set({ upvotes: sql`${forumPosts.upvotes} + 1` })
      .where(eq(forumPosts.id, postId));
  }

  async upvoteReply(replyId: string): Promise<void> {
    await db
      .update(forumReplies)
      .set({ upvotes: sql`${forumReplies.upvotes} + 1` })
      .where(eq(forumReplies.id, replyId));
  }

  // Emergency contacts
  async getEmergencyContacts(): Promise<EmergencyContact[]> {
    return await db
      .select()
      .from(emergencyContacts)
      .where(eq(emergencyContacts.isActive, true));
  }

  async createEmergencyContact(contact: InsertEmergencyContact): Promise<EmergencyContact> {
    const [newContact] = await db.insert(emergencyContacts).values(contact).returning();
    return newContact;
  }
}

export const storage = new DatabaseStorage();
