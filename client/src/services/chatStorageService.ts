interface ChatMessage {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
}

interface ChatConversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

class ChatStorageService {
  private readonly STORAGE_KEY = "webcrafters_chat_history";

  // Get all conversations for current user
  getAllConversations(): ChatConversation[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) return [];
      
      const conversations = JSON.parse(stored);
      return conversations.map((conv: any) => ({
        ...conv,
        createdAt: new Date(conv.createdAt),
        updatedAt: new Date(conv.updatedAt),
        messages: conv.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }))
      }));
    } catch (error) {
      console.error("Error loading chat history:", error);
      return [];
    }
  }

  // Get specific conversation by ID
  getConversation(conversationId: string): ChatConversation | null {
    const conversations = this.getAllConversations();
    return conversations.find(conv => conv.id === conversationId) || null;
  }

  // Create new conversation
  createConversation(firstMessage?: ChatMessage): ChatConversation {
    const newConversation: ChatConversation = {
      id: `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: this.generateTitle(firstMessage?.text || "New Chat"),
      messages: firstMessage ? [firstMessage] : [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.saveConversation(newConversation);
    return newConversation;
  }

  // Save/update conversation
  saveConversation(conversation: ChatConversation): void {
    try {
      const conversations = this.getAllConversations();
      const existingIndex = conversations.findIndex(conv => conv.id === conversation.id);
      
      conversation.updatedAt = new Date();
      
      if (existingIndex >= 0) {
        conversations[existingIndex] = conversation;
      } else {
        conversations.unshift(conversation); // Add to beginning
      }

      // Keep only last 50 conversations to prevent storage overflow
      const limitedConversations = conversations.slice(0, 50);
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(limitedConversations));
    } catch (error) {
      console.error("Error saving chat history:", error);
    }
  }

  // Add message to conversation
  addMessageToConversation(conversationId: string, message: ChatMessage): void {
    const conversation = this.getConversation(conversationId);
    if (conversation) {
      conversation.messages.push(message);
      
      // Update title if it's the first user message
      if (conversation.messages.length === 2 && message.sender === "ai") {
        const userMessage = conversation.messages[0];
        conversation.title = this.generateTitle(userMessage.text);
      }
      
      this.saveConversation(conversation);
    }
  }

  // Delete conversation
  deleteConversation(conversationId: string): void {
    try {
      const conversations = this.getAllConversations();
      const filteredConversations = conversations.filter(conv => conv.id !== conversationId);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredConversations));
    } catch (error) {
      console.error("Error deleting conversation:", error);
    }
  }

  // Generate smart title from first message
  private generateTitle(firstMessage: string): string {
    if (!firstMessage) return "New Chat";
    
    // Clean and truncate the message
    const cleaned = firstMessage.trim().replace(/\n/g, ' ');
    if (cleaned.length <= 40) return cleaned;
    
    // Find good breaking point
    const truncated = cleaned.substring(0, 37);
    const lastSpace = truncated.lastIndexOf(' ');
    
    if (lastSpace > 20) {
      return truncated.substring(0, lastSpace) + "...";
    }
    
    return truncated + "...";
  }

  // Clear all chat history
  clearAllHistory(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.error("Error clearing chat history:", error);
    }
  }

  // Export chat history
  exportHistory(): string {
    const conversations = this.getAllConversations();
    return JSON.stringify(conversations, null, 2);
  }
}

export const chatStorageService = new ChatStorageService();
export type { ChatMessage, ChatConversation };