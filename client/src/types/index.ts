// Common types used across the application

export interface User {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  studentId?: string;
  isAnonymous: boolean;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ChatConversation {
  id: string;
  userId: string;
  title?: string;
  createdAt: Date;
  updatedAt: Date;
  messages?: ChatMessage[];
}

export interface Counselor {
  id: string;
  name: string;
  credentials?: string;
  specializations: string[];
  languages: string[];
  bio?: string;
  rating: number;
  isAvailable: boolean;
  imageUrl?: string;
}

export interface Appointment {
  id: string;
  userId: string;
  counselorId: string;
  dateTime: Date;
  duration: number;
  sessionType: 'in-person' | 'video' | 'phone' | 'crisis';
  primaryConcern?: string;
  urgencyLevel: 'routine' | 'moderate' | 'high' | 'crisis';
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
  additionalInfo?: string;
  counselor?: Counselor;
}

export interface Assessment {
  id: string;
  userId: string;
  assessmentType: 'PHQ-9' | 'GAD-7' | 'GHQ-12' | 'PSS-10';
  responses: any[];
  totalScore: number;
  interpretation: 'minimal' | 'mild' | 'moderate' | 'severe';
  recommendations: string[];
  completedAt: Date;
}

export interface Resource {
  id: string;
  title: string;
  description?: string;
  type: 'video' | 'audio' | 'pdf' | 'article';
  category: 'anxiety' | 'depression' | 'stress' | 'sleep' | 'academic' | 'general';
  language: string;
  url?: string;
  thumbnailUrl?: string;
  duration?: number;
  isFeatured: boolean;
  tags: string[];
  createdAt: Date;
}

export interface ForumCategory {
  id: string;
  name: string;
  description?: string;
  color: string;
  isActive: boolean;
}

export interface ForumPost {
  id: string;
  userId: string;
  categoryId: string;
  title: string;
  content: string;
  isAnonymous: boolean;
  upvotes: number;
  replyCount: number;
  isModerated: boolean;
  isApproved: boolean;
  createdAt: Date;
  updatedAt: Date;
  category?: ForumCategory;
}

export interface ForumReply {
  id: string;
  postId: string;
  userId: string;
  content: string;
  isAnonymous: boolean;
  upvotes: number;
  isModerated: boolean;
  isApproved: boolean;
  createdAt: Date;
}

export interface EmergencyContact {
  id: string;
  name: string;
  phoneNumber?: string;
  description?: string;
  type: 'hotline' | 'campus' | 'hospital' | 'crisis';
  isAvailable247: boolean;
  location?: string;
  isActive: boolean;
}

// Assessment question types
export interface AssessmentQuestion {
  id: string;
  question: string;
  options: AssessmentOption[];
}

export interface AssessmentOption {
  value: number;
  text: string;
}

// Chat AI response types
export interface ChatAIResponse {
  message: string;
  suggestions?: string[];
  resources?: string[];
  escalation?: boolean;
}

// API response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

// Form validation types
export interface ValidationError {
  field: string;
  message: string;
}

// Dashboard statistics
export interface DashboardStats {
  totalStudentsHelped: number;
  activeSupportGroups: number;
  availableCounselors: number;
  averageResponseTime: string;
  userProgress?: {
    assessments: number;
    appointments: number;
    resourcesViewed: number;
    forumPosts: number;
  };
}

// WebSocket message types
export interface WebSocketMessage {
  type: 'chat_message' | 'message_saved' | 'typing' | 'error';
  conversationId?: string;
  role?: 'user' | 'assistant';
  content?: string;
  message?: ChatMessage;
  timestamp?: Date;
}

// Filter and search types
export interface ResourceFilters {
  category?: string;
  type?: string;
  language?: string;
  search?: string;
}

export interface ForumFilters {
  categoryId?: string;
  sortBy?: 'recent' | 'popular' | 'replies';
}

// Calendar and scheduling types
export interface TimeSlot {
  start: Date;
  end: Date;
  available: boolean;
  counselorId?: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  type: 'appointment' | 'assessment' | 'event';
  status?: string;
}

// Theme and UI types
export type ThemeMode = 'light' | 'dark' | 'system';

// Navigation types
export interface NavItem {
  path: string;
  label: string;
  icon: any;
  active: boolean;
  isEmergency?: boolean;
}

// Loading and error states
export interface LoadingState {
  isLoading: boolean;
  error?: string;
}

// Pagination
export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  hasNext: boolean;
  hasPrev: boolean;
}
