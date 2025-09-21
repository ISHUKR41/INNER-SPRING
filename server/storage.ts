import { 
  users, chatConversations, chatMessages, counselors, appointments, 
  assessments, resources, forumCategories, forumPosts, forumReplies, 
  emergencyContacts, crisisContacts,
  type User, type InsertUser, type ChatConversation, type InsertChatConversation,
  type ChatMessage, type InsertChatMessage, type Counselor, type InsertCounselor,
  type Appointment, type InsertAppointment, type Assessment, type InsertAssessment,
  type Resource, type InsertResource, type ForumCategory, type InsertForumCategory,
  type ForumPost, type InsertForumPost, type ForumReply, type InsertForumReply,
  type EmergencyContact, type InsertEmergencyContact, type CrisisContact, type InsertCrisisContact
} from "@shared/schema";
import { db, hasDb } from "./db";
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

  // Crisis contacts
  getCrisisContacts(country?: string): Promise<CrisisContact[]>;
  getCrisisContact(id: string): Promise<CrisisContact | undefined>;
  createCrisisContact(contact: InsertCrisisContact): Promise<CrisisContact>;
  updateCrisisContact(id: string, updates: Partial<CrisisContact>): Promise<CrisisContact | undefined>;
  getActiveCrisisContacts(country?: string): Promise<CrisisContact[]>;
  getCrisisContactsByType(type: string, country?: string): Promise<CrisisContact[]>;
}

// In-memory storage implementation for development and fallback
class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private chatConversations: Map<string, ChatConversation> = new Map();
  private chatMessages: Map<string, ChatMessage> = new Map();
  private counselors: Map<string, Counselor> = new Map();
  private appointments: Map<string, Appointment> = new Map();
  private assessments: Map<string, Assessment> = new Map();
  private resources: Map<string, Resource> = new Map();
  private forumCategories: Map<string, ForumCategory> = new Map();
  private forumPosts: Map<string, ForumPost> = new Map();
  private forumReplies: Map<string, ForumReply> = new Map();
  private emergencyContacts: Map<string, EmergencyContact> = new Map();
  private crisisContacts: Map<string, CrisisContact> = new Map();

  private generateId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }


  // User management
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    for (const user of Array.from(this.users.values())) {
      if (user.username === username) return user;
    }
    return undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    for (const user of Array.from(this.users.values())) {
      if (user.email === email) return user;
    }
    return undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const user: User = {
      id: this.generateId(),
      username: insertUser.username,
      email: insertUser.email,
      password: insertUser.password,
      firstName: insertUser.firstName ?? null,
      lastName: insertUser.lastName ?? null,
      studentId: insertUser.studentId ?? null,
      isAnonymous: insertUser.isAnonymous ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.set(user.id, user);
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates, updatedAt: new Date() };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Chat functionality
  async createChatConversation(conversation: InsertChatConversation): Promise<ChatConversation> {
    const conv: ChatConversation = {
      id: this.generateId(),
      userId: conversation.userId ?? null,
      title: conversation.title ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.chatConversations.set(conv.id, conv);
    return conv;
  }

  async getChatConversations(userId: string): Promise<ChatConversation[]> {
    return Array.from(this.chatConversations.values())
      .filter(conv => conv.userId === userId)
      .sort((a, b) => b.updatedAt!.getTime() - a.updatedAt!.getTime());
  }

  async getChatMessages(conversationId: string): Promise<ChatMessage[]> {
    return Array.from(this.chatMessages.values())
      .filter(msg => msg.conversationId === conversationId)
      .sort((a, b) => a.timestamp!.getTime() - b.timestamp!.getTime());
  }

  async createChatMessage(message: InsertChatMessage): Promise<ChatMessage> {
    if (!message.conversationId) {
      throw new Error("Conversation ID is required for chat messages");
    }
    
    if (!this.chatConversations.has(message.conversationId)) {
      throw new Error("Invalid conversation ID: conversation does not exist");
    }
    
    const msg: ChatMessage = {
      id: this.generateId(),
      ...message,
      timestamp: new Date(),
    };
    this.chatMessages.set(msg.id, msg);
    
    // Update conversation timestamp
    const conv = this.chatConversations.get(message.conversationId);
    if (conv) {
      conv.updatedAt = new Date();
      this.chatConversations.set(message.conversationId, conv);
    }
    
    return msg;
  }

  async updateConversationTitle(id: string, title: string): Promise<void> {
    const conv = this.chatConversations.get(id);
    if (conv) {
      conv.title = title;
      conv.updatedAt = new Date();
      this.chatConversations.set(id, conv);
    }
  }

  // Counselors
  async getCounselors(): Promise<Counselor[]> {
    return Array.from(this.counselors.values()).filter(c => c.isAvailable);
  }

  async getCounselor(id: string): Promise<Counselor | undefined> {
    return this.counselors.get(id);
  }

  async createCounselor(counselor: InsertCounselor): Promise<Counselor> {
    const newCounselor: Counselor = {
      id: this.generateId(),
      name: counselor.name,
      credentials: counselor.credentials ?? null,
      specializations: counselor.specializations ?? null,
      languages: counselor.languages ?? null,
      bio: counselor.bio ?? null,
      rating: counselor.rating ?? null,
      isAvailable: counselor.isAvailable ?? null,
      imageUrl: counselor.imageUrl ?? null,
    };
    this.counselors.set(newCounselor.id, newCounselor);
    return newCounselor;
  }

  async getAvailableCounselors(): Promise<Counselor[]> {
    return Array.from(this.counselors.values()).filter(c => c.isAvailable);
  }

  // Appointments
  async createAppointment(appointment: InsertAppointment): Promise<Appointment> {
    if (!appointment.userId) {
      throw new Error("User ID is required for appointments");
    }
    
    if (!appointment.counselorId) {
      throw new Error("Counselor ID is required for appointments");
    }
    
    if (!this.users.has(appointment.userId)) {
      throw new Error("Invalid user ID: user does not exist");
    }
    
    const counselor = this.counselors.get(appointment.counselorId);
    if (!counselor) {
      throw new Error("Invalid counselor ID: counselor does not exist");
    }
    
    if (!counselor.isAvailable) {
      throw new Error("Counselor is not available for appointments");
    }
    
    const newAppointment: Appointment = {
      id: this.generateId(),
      userId: appointment.userId ?? null,
      counselorId: appointment.counselorId ?? null,
      dateTime: appointment.dateTime,
      duration: appointment.duration ?? null,
      sessionType: appointment.sessionType,
      primaryConcern: appointment.primaryConcern ?? null,
      urgencyLevel: appointment.urgencyLevel ?? null,
      status: appointment.status ?? null,
      additionalInfo: appointment.additionalInfo ?? null,
      createdAt: new Date(),
    };
    this.appointments.set(newAppointment.id, newAppointment);
    return newAppointment;
  }

  async getAppointments(userId: string): Promise<Appointment[]> {
    return Array.from(this.appointments.values())
      .filter(appt => appt.userId === userId)
      .sort((a, b) => b.dateTime.getTime() - a.dateTime.getTime());
  }

  async getAppointment(id: string): Promise<Appointment | undefined> {
    return this.appointments.get(id);
  }

  async updateAppointment(id: string, updates: Partial<Appointment>): Promise<Appointment | undefined> {
    const appointment = this.appointments.get(id);
    if (!appointment) return undefined;
    
    const updatedAppointment = { ...appointment, ...updates };
    this.appointments.set(id, updatedAppointment);
    return updatedAppointment;
  }

  async getAppointmentsByDateRange(counselorId: string, startDate: Date, endDate: Date): Promise<Appointment[]> {
    return Array.from(this.appointments.values())
      .filter(appt => 
        appt.counselorId === counselorId &&
        appt.dateTime >= startDate &&
        appt.dateTime <= endDate
      );
  }

  async cancelAppointment(id: string): Promise<void> {
    const appointment = this.appointments.get(id);
    if (appointment) {
      appointment.status = 'cancelled';
      this.appointments.set(id, appointment);
    }
  }

  // Assessments
  async createAssessment(assessment: InsertAssessment): Promise<Assessment> {
    const newAssessment: Assessment = {
      id: this.generateId(),
      userId: assessment.userId ?? null,
      assessmentType: assessment.assessmentType,
      responses: assessment.responses,
      totalScore: assessment.totalScore,
      interpretation: assessment.interpretation,
      recommendations: assessment.recommendations ?? null,
      completedAt: new Date(),
    };
    this.assessments.set(newAssessment.id, newAssessment);
    return newAssessment;
  }

  async getAssessments(userId: string): Promise<Assessment[]> {
    return Array.from(this.assessments.values())
      .filter(assessment => assessment.userId === userId)
      .sort((a, b) => b.completedAt!.getTime() - a.completedAt!.getTime());
  }

  async getLatestAssessment(userId: string, type: string): Promise<Assessment | undefined> {
    const userAssessments = Array.from(this.assessments.values())
      .filter(assessment => assessment.userId === userId && assessment.assessmentType === type)
      .sort((a, b) => b.completedAt!.getTime() - a.completedAt!.getTime());
    
    return userAssessments[0];
  }

  // Resources
  async getResources(category?: string, type?: string, language?: string): Promise<Resource[]> {
    let results = Array.from(this.resources.values());
    
    if (category) results = results.filter(r => r.category === category);
    if (type) results = results.filter(r => r.type === type);
    if (language) results = results.filter(r => r.language === language);
    
    return results.sort((a, b) => b.createdAt!.getTime() - a.createdAt!.getTime());
  }

  async getResource(id: string): Promise<Resource | undefined> {
    return this.resources.get(id);
  }

  async getFeaturedResources(): Promise<Resource[]> {
    return Array.from(this.resources.values())
      .filter(r => r.isFeatured)
      .slice(0, 6);
  }

  async createResource(resource: InsertResource): Promise<Resource> {
    const newResource: Resource = {
      id: this.generateId(),
      title: resource.title,
      description: resource.description ?? null,
      url: resource.url ?? null,
      thumbnailUrl: resource.thumbnailUrl ?? null,
      duration: resource.duration ?? null,
      type: resource.type,
      category: resource.category,
      language: resource.language ?? null,
      isFeatured: resource.isFeatured ?? null,
      tags: resource.tags ?? null,
      createdAt: new Date(),
    };
    this.resources.set(newResource.id, newResource);
    return newResource;
  }

  async searchResources(query: string): Promise<Resource[]> {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.resources.values())
      .filter(r => 
        r.title.toLowerCase().includes(lowerQuery) ||
        r.description?.toLowerCase().includes(lowerQuery)
      );
  }

  // Forum
  async getForumCategories(): Promise<ForumCategory[]> {
    return Array.from(this.forumCategories.values()).filter(c => c.isActive);
  }

  async createForumCategory(category: InsertForumCategory): Promise<ForumCategory> {
    const newCategory: ForumCategory = {
      id: this.generateId(),
      name: category.name,
      description: category.description ?? null,
      color: category.color ?? null,
      isActive: category.isActive ?? null,
    };
    this.forumCategories.set(newCategory.id, newCategory);
    return newCategory;
  }

  async getForumPosts(categoryId?: string, limit = 20): Promise<ForumPost[]> {
    let posts = Array.from(this.forumPosts.values()).filter(p => p.isApproved);
    
    if (categoryId) {
      posts = posts.filter(p => p.categoryId === categoryId);
    }
    
    return posts
      .sort((a, b) => b.createdAt!.getTime() - a.createdAt!.getTime())
      .slice(0, limit);
  }

  async getForumPost(id: string): Promise<ForumPost | undefined> {
    return this.forumPosts.get(id);
  }

  async createForumPost(post: InsertForumPost): Promise<ForumPost> {
    const newPost: ForumPost = {
      id: this.generateId(),
      userId: post.userId ?? null,
      title: post.title,
      content: post.content,
      categoryId: post.categoryId ?? null,
      isAnonymous: post.isAnonymous ?? null,
      upvotes: 0,
      replyCount: 0,
      isModerated: post.isModerated ?? null,
      isApproved: post.isApproved ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.forumPosts.set(newPost.id, newPost);
    return newPost;
  }

  async getForumReplies(postId: string): Promise<ForumReply[]> {
    return Array.from(this.forumReplies.values())
      .filter(r => r.postId === postId && r.isApproved)
      .sort((a, b) => a.createdAt!.getTime() - b.createdAt!.getTime());
  }

  async createForumReply(reply: InsertForumReply): Promise<ForumReply> {
    if (!reply.postId) {
      throw new Error("Post ID is required for forum replies");
    }
    
    if (!this.forumPosts.has(reply.postId)) {
      throw new Error("Invalid post ID: forum post does not exist");
    }
    
    const newReply: ForumReply = {
      id: this.generateId(),
      userId: reply.userId ?? null,
      postId: reply.postId,
      content: reply.content,
      isAnonymous: reply.isAnonymous ?? null,
      upvotes: 0,
      isModerated: reply.isModerated ?? null,
      isApproved: reply.isApproved ?? null,
      createdAt: new Date(),
    };
    this.forumReplies.set(newReply.id, newReply);
    
    // Update post reply count
    const post = this.forumPosts.get(reply.postId);
    if (post) {
      post.replyCount = (post.replyCount || 0) + 1;
      post.updatedAt = new Date();
      this.forumPosts.set(reply.postId, post);
    }
    
    return newReply;
  }

  async upvotePost(postId: string): Promise<void> {
    const post = this.forumPosts.get(postId);
    if (post) {
      post.upvotes = (post.upvotes || 0) + 1;
      this.forumPosts.set(postId, post);
    }
  }

  async upvoteReply(replyId: string): Promise<void> {
    const reply = this.forumReplies.get(replyId);
    if (reply) {
      reply.upvotes = (reply.upvotes || 0) + 1;
      this.forumReplies.set(replyId, reply);
    }
  }

  // Emergency contacts
  async getEmergencyContacts(): Promise<EmergencyContact[]> {
    return Array.from(this.emergencyContacts.values()).filter(c => c.isActive);
  }

  async createEmergencyContact(contact: InsertEmergencyContact): Promise<EmergencyContact> {
    const newContact: EmergencyContact = {
      id: this.generateId(),
      name: contact.name,
      type: contact.type,
      description: contact.description ?? null,
      phoneNumber: contact.phoneNumber ?? null,
      isActive: contact.isActive ?? null,
      isAvailable247: contact.isAvailable247 ?? null,
      location: contact.location ?? null,
    };
    this.emergencyContacts.set(newContact.id, newContact);
    return newContact;
  }

  // Crisis contacts
  async getCrisisContacts(country?: string): Promise<CrisisContact[]> {
    let contacts = Array.from(this.crisisContacts.values()).filter(c => c.isActive);
    
    if (country) {
      contacts = contacts.filter(c => c.country === country);
    }
    
    return contacts.sort((a, b) => {
      if (a.priority !== b.priority) return (a.priority || 1) - (b.priority || 1);
      return a.name.localeCompare(b.name);
    });
  }

  async getCrisisContact(id: string): Promise<CrisisContact | undefined> {
    return this.crisisContacts.get(id);
  }

  async createCrisisContact(contact: InsertCrisisContact): Promise<CrisisContact> {
    if (!contact.name || !contact.country || !contact.type) {
      throw new Error("Crisis contact must have name, country, and type specified");
    }

    if (!contact.phone && !contact.sms && !contact.chatUrl) {
      throw new Error("Crisis contact must have at least one contact method (phone, SMS, or chat URL)");
    }

    const newContact: CrisisContact = {
      id: this.generateId(),
      name: contact.name,
      type: contact.type,
      description: contact.description,
      country: contact.country,
      languages: contact.languages ?? null,
      phone: contact.phone ?? null,
      sms: contact.sms ?? null,
      chatUrl: contact.chatUrl ?? null,
      availability: contact.availability,
      isActive: contact.isActive ?? null,
      priority: contact.priority ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.crisisContacts.set(newContact.id, newContact);
    return newContact;
  }

  async updateCrisisContact(id: string, updates: Partial<CrisisContact>): Promise<CrisisContact | undefined> {
    const contact = this.crisisContacts.get(id);
    if (!contact) return undefined;
    
    const updatedContact = {
      ...contact,
      ...updates,
      updatedAt: new Date()
    };
    this.crisisContacts.set(id, updatedContact);
    return updatedContact;
  }

  async getActiveCrisisContacts(country?: string): Promise<CrisisContact[]> {
    return await this.getCrisisContacts(country);
  }

  async getCrisisContactsByType(type: string, country?: string): Promise<CrisisContact[]> {
    let contacts = Array.from(this.crisisContacts.values())
      .filter(c => c.isActive && c.type === type);
    
    if (country) {
      contacts = contacts.filter(c => c.country === country);
    }
    
    return contacts.sort((a, b) => {
      if (a.priority !== b.priority) return (a.priority || 1) - (b.priority || 1);
      return a.name.localeCompare(b.name);
    });
  }
}

export class DatabaseStorage implements IStorage {
  constructor() {
    if (!db) {
      throw new Error("Database not available - use MemStorage instead");
    }
  }

  // User management
  async getUser(id: string): Promise<User | undefined> {
    if (!db) throw new Error("Database not available");
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    if (!db) throw new Error("Database not available");
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    if (!db) throw new Error("Database not available");
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    if (!db) throw new Error("Database not available");
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    if (!db) throw new Error("Database not available");
    const [user] = await db
      .update(users)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user || undefined;
  }

  // Chat functionality
  async createChatConversation(conversation: InsertChatConversation): Promise<ChatConversation> {
    if (!db) throw new Error("Database not available");
    const [conv] = await db.insert(chatConversations).values(conversation).returning();
    return conv;
  }

  async getChatConversations(userId: string): Promise<ChatConversation[]> {
    if (!db) throw new Error("Database not available");
    return await db
      .select()
      .from(chatConversations)
      .where(eq(chatConversations.userId, userId))
      .orderBy(desc(chatConversations.updatedAt));
  }

  async getChatMessages(conversationId: string): Promise<ChatMessage[]> {
    if (!db) throw new Error("Database not available");
    return await db
      .select()
      .from(chatMessages)
      .where(eq(chatMessages.conversationId, conversationId))
      .orderBy(chatMessages.timestamp);
  }

  async createChatMessage(message: InsertChatMessage): Promise<ChatMessage> {
    if (!db) throw new Error("Database not available");
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
    if (!db) throw new Error("Database not available");
    await db
      .update(chatConversations)
      .set({ title, updatedAt: new Date() })
      .where(eq(chatConversations.id, id));
  }

  // Counselors
  async getCounselors(): Promise<Counselor[]> {
    if (!db) throw new Error("Database not available");
    return await db.select().from(counselors).where(eq(counselors.isAvailable, true));
  }

  async getCounselor(id: string): Promise<Counselor | undefined> {
    if (!db) throw new Error("Database not available");
    const [counselor] = await db.select().from(counselors).where(eq(counselors.id, id));
    return counselor || undefined;
  }

  async createCounselor(counselor: InsertCounselor): Promise<Counselor> {
    if (!db) throw new Error("Database not available");
    const [newCounselor] = await db.insert(counselors).values(counselor).returning();
    return newCounselor;
  }

  async getAvailableCounselors(): Promise<Counselor[]> {
    if (!db) throw new Error("Database not available");
    return await db
      .select()
      .from(counselors)
      .where(eq(counselors.isAvailable, true));
  }

  // Appointments
  async createAppointment(appointment: InsertAppointment): Promise<Appointment> {
    if (!db) throw new Error("Database not available");
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
    if (!db) throw new Error("Database not available");
    return await db
      .select()
      .from(appointments)
      .where(eq(appointments.userId, userId))
      .orderBy(desc(appointments.dateTime));
  }

  async getAppointment(id: string): Promise<Appointment | undefined> {
    if (!db) throw new Error("Database not available");
    const [appointment] = await db.select().from(appointments).where(eq(appointments.id, id));
    return appointment || undefined;
  }

  async updateAppointment(id: string, updates: Partial<Appointment>): Promise<Appointment | undefined> {
    if (!db) throw new Error("Database not available");
    const [appointment] = await db
      .update(appointments)
      .set(updates)
      .where(eq(appointments.id, id))
      .returning();
    return appointment || undefined;
  }

  async getAppointmentsByDateRange(counselorId: string, startDate: Date, endDate: Date): Promise<Appointment[]> {
    if (!db) throw new Error("Database not available");
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
    if (!db) throw new Error("Database not available");
    await db
      .update(appointments)
      .set({ status: 'cancelled' })
      .where(eq(appointments.id, id));
  }

  // Assessments
  async createAssessment(assessment: InsertAssessment): Promise<Assessment> {
    if (!db) throw new Error("Database not available");
    const [newAssessment] = await db.insert(assessments).values(assessment).returning();
    return newAssessment;
  }

  async getAssessments(userId: string): Promise<Assessment[]> {
    if (!db) throw new Error("Database not available");
    return await db
      .select()
      .from(assessments)
      .where(eq(assessments.userId, userId))
      .orderBy(desc(assessments.completedAt));
  }

  async getLatestAssessment(userId: string, type: string): Promise<Assessment | undefined> {
    if (!db) throw new Error("Database not available");
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
    if (!db) throw new Error("Database not available");
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
    if (!db) throw new Error("Database not available");
    const [resource] = await db.select().from(resources).where(eq(resources.id, id));
    return resource || undefined;
  }

  async getFeaturedResources(): Promise<Resource[]> {
    if (!db) throw new Error("Database not available");
    return await db
      .select()
      .from(resources)
      .where(eq(resources.isFeatured, true))
      .limit(6);
  }

  async createResource(resource: InsertResource): Promise<Resource> {
    if (!db) throw new Error("Database not available");
    const [newResource] = await db.insert(resources).values(resource).returning();
    return newResource;
  }

  async searchResources(query: string): Promise<Resource[]> {
    if (!db) throw new Error("Database not available");
    return await db
      .select()
      .from(resources)
      .where(
        sql`${resources.title} ILIKE ${`%${query}%`} OR ${resources.description} ILIKE ${`%${query}%`}`
      );
  }

  // Forum
  async getForumCategories(): Promise<ForumCategory[]> {
    if (!db) throw new Error("Database not available");
    return await db
      .select()
      .from(forumCategories)
      .where(eq(forumCategories.isActive, true));
  }

  async createForumCategory(category: InsertForumCategory): Promise<ForumCategory> {
    if (!db) throw new Error("Database not available");
    const [newCategory] = await db.insert(forumCategories).values(category).returning();
    return newCategory;
  }

  async getForumPosts(categoryId?: string, limit = 20): Promise<ForumPost[]> {
    if (!db) throw new Error("Database not available");
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
    if (!db) throw new Error("Database not available");
    const [post] = await db.select().from(forumPosts).where(eq(forumPosts.id, id));
    return post || undefined;
  }

  async createForumPost(post: InsertForumPost): Promise<ForumPost> {
    if (!db) throw new Error("Database not available");
    const [newPost] = await db.insert(forumPosts).values(post).returning();
    return newPost;
  }

  async getForumReplies(postId: string): Promise<ForumReply[]> {
    if (!db) throw new Error("Database not available");
    return await db
      .select()
      .from(forumReplies)
      .where(and(eq(forumReplies.postId, postId), eq(forumReplies.isApproved, true)))
      .orderBy(forumReplies.createdAt);
  }

  async createForumReply(reply: InsertForumReply): Promise<ForumReply> {
    if (!db) throw new Error("Database not available");
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
    if (!db) throw new Error("Database not available");
    await db
      .update(forumPosts)
      .set({ upvotes: sql`${forumPosts.upvotes} + 1` })
      .where(eq(forumPosts.id, postId));
  }

  async upvoteReply(replyId: string): Promise<void> {
    if (!db) throw new Error("Database not available");
    await db
      .update(forumReplies)
      .set({ upvotes: sql`${forumReplies.upvotes} + 1` })
      .where(eq(forumReplies.id, replyId));
  }

  // Emergency contacts
  async getEmergencyContacts(): Promise<EmergencyContact[]> {
    if (!db) throw new Error("Database not available");
    return await db
      .select()
      .from(emergencyContacts)
      .where(eq(emergencyContacts.isActive, true));
  }

  async createEmergencyContact(contact: InsertEmergencyContact): Promise<EmergencyContact> {
    if (!db) throw new Error("Database not available");
    const [newContact] = await db.insert(emergencyContacts).values(contact).returning();
    return newContact;
  }

  // Crisis contacts - Specialized crisis intervention support methods
  async getCrisisContacts(country?: string): Promise<CrisisContact[]> {
    if (!db) throw new Error("Database not available");
    // Build query conditions for optional country filtering
    const conditions = [eq(crisisContacts.isActive, true)];
    if (country) {
      conditions.push(eq(crisisContacts.country, country));
    }

    return await db
      .select()
      .from(crisisContacts)
      .where(and(...conditions))
      .orderBy(crisisContacts.priority, crisisContacts.name); // Order by priority first, then name
  }

  async getCrisisContact(id: string): Promise<CrisisContact | undefined> {
    if (!db) throw new Error("Database not available");
    const [contact] = await db
      .select()
      .from(crisisContacts)
      .where(eq(crisisContacts.id, id));
    return contact || undefined;
  }

  async createCrisisContact(contact: InsertCrisisContact): Promise<CrisisContact> {
    if (!db) throw new Error("Database not available");
    // Security validation: Ensure required fields are present
    if (!contact.name || !contact.country || !contact.type) {
      throw new Error("Crisis contact must have name, country, and type specified");
    }

    // Business logic: Validate at least one contact method is provided
    if (!contact.phone && !contact.sms && !contact.chatUrl) {
      throw new Error("Crisis contact must have at least one contact method (phone, SMS, or chat URL)");
    }

    const [newContact] = await db.insert(crisisContacts).values(contact).returning();
    return newContact;
  }

  async updateCrisisContact(id: string, updates: Partial<CrisisContact>): Promise<CrisisContact | undefined> {
    if (!db) throw new Error("Database not available");
    // Security: Update timestamp for data freshness tracking
    const updateData = {
      ...updates,
      updatedAt: new Date()
    };

    const [contact] = await db
      .update(crisisContacts)
      .set(updateData)
      .where(eq(crisisContacts.id, id))
      .returning();
    return contact || undefined;
  }

  async getActiveCrisisContacts(country?: string): Promise<CrisisContact[]> {
    // This method specifically filters for active contacts and optional country
    return await this.getCrisisContacts(country);
  }

  async getCrisisContactsByType(type: string, country?: string): Promise<CrisisContact[]> {
    if (!db) throw new Error("Database not available");
    // Build query conditions for type and optional country filtering
    const conditions = [
      eq(crisisContacts.isActive, true),
      eq(crisisContacts.type, type)
    ];
    if (country) {
      conditions.push(eq(crisisContacts.country, country));
    }

    return await db
      .select()
      .from(crisisContacts)
      .where(and(...conditions))
      .orderBy(crisisContacts.priority, crisisContacts.name);
  }
}

// Create storage instance based on database availability
// Prefer MemStorage for development per project guidelines
export const storage: IStorage = hasDb ? new DatabaseStorage() : new MemStorage();

// Log which storage implementation is being used
if (hasDb) {
  console.log("🗄️  Using DatabaseStorage (PostgreSQL)");
} else {
  console.log("💾 Using MemStorage (in-memory fallback)");
}
