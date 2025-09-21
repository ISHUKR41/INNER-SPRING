import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import Header from "@/components/layout/Header";
import ChatInterface from "./components/ChatInterface";
import ChatSidebar from "@/components/chat/ChatSidebar";
import { Button } from "@/components/ui/button";
import { 
  MessageCircle, 
  AlertTriangle,
  Calendar,
  BookOpen,
  Brain,
  Lock
} from "lucide-react";
import { useChatWebSocket } from "@/hooks/use-websocket";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import type { ChatConversation, ChatMessage } from "@/types";

/**
 * AI Chatbot Page - Real-time chat interface with conversation management
 * Features AI-powered mental health support with crisis detection
 */
export default function ChatBot() {
  const [, setLocation] = useLocation();
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  
  // Enhanced header state for chat mode
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isAnonymousMode, setIsAnonymousMode] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(true);
  
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Test user ID - using existing user from database
  const userId = "d40d10cf-47fd-43e1-a4a7-9ff3b9bd94c7";

  // Fetch user's conversations with proper typing and default empty array
  const { data: conversations = [], isLoading: conversationsLoading } = useQuery<ChatConversation[]>({
    queryKey: [`/api/chat/conversations/${userId}`],
    enabled: !!userId,
  });

  // Fetch messages for selected conversation with proper typing and default empty array
  const { data: messages = [], isLoading: messagesLoading } = useQuery<ChatMessage[]>({
    queryKey: [`/api/chat/messages`, selectedConversationId],
    enabled: !!selectedConversationId,
  });

  // WebSocket for real-time chat with message deduplication
  const { sendMessage: sendWsMessage, connectionState } = useChatWebSocket(
    selectedConversationId || "",
    (newMessage) => {
      // Update messages cache when new message received, with deduplication
      // Use the message's conversationId to avoid stale closure issues
      const cacheKey = [`/api/chat/messages`, newMessage.conversationId];
      queryClient.setQueryData(
        cacheKey,
        (oldMessages: ChatMessage[] = []) => {
          // Check if message already exists to prevent duplication
          const messageExists = oldMessages.some(msg => msg.id === newMessage.id);
          if (messageExists) {
            console.log('Message already exists in cache, skipping duplicate');
            return oldMessages;
          }
          console.log('Adding new message to cache via WebSocket:', newMessage.id, 'to conversation:', newMessage.conversationId);
          return [...oldMessages, newMessage];
        }
      );
    }
  );

  // Create new conversation mutation
  const createConversationMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/chat/conversations", {
        userId,
        title: "New Chat"
      });
      return await response.json();
    },
    onSuccess: (newConversation) => {
      queryClient.invalidateQueries({ queryKey: [`/api/chat/conversations/${userId}`] });
      setSelectedConversationId(newConversation.id);
      setIsMobileSidebarOpen(false);
      toast({
        title: "New conversation started",
        description: "You can now chat with the AI assistant.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create new conversation. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async ({ conversationId, content }: { conversationId: string; content: string }) => {
      const response = await apiRequest("POST", "/api/chat/message", {
        conversationId,
        role: "user",
        content
      });
      return await response.json();
    },
    onSuccess: (data) => {
      // Update messages cache with both user and AI messages using segmented key
      const conversationId = data.userMessage.conversationId;
      queryClient.setQueryData(
        [`/api/chat/messages`, conversationId],
        (oldMessages: ChatMessage[] = []) => {
          const newMessages = [data.userMessage, data.aiMessage];
          // Check for duplicates to prevent double addition
          const existingIds = new Set(oldMessages.map(msg => msg.id));
          const uniqueNewMessages = newMessages.filter(msg => !existingIds.has(msg.id));
          if (uniqueNewMessages.length === 0) {
            console.log('All messages already exist in cache via REST, skipping duplicates');
            return oldMessages;
          }
          return [...oldMessages, ...uniqueNewMessages];
        }
      );

      // Handle escalation if AI detected crisis
      if (data.escalation) {
        toast({
          title: "Crisis Support Available",
          description: "The AI has detected you may need immediate support. Consider reaching out to a counselor.",
          variant: "destructive",
          action: (
            <Button size="sm" asChild>
              <a href="/emergency">Get Help Now</a>
            </Button>
          ),
        });
      }

      // Update conversation list to reflect latest activity
      queryClient.invalidateQueries({ queryKey: [`/api/chat/conversations/${userId}`] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Delete conversation mutation
  const deleteConversationMutation = useMutation({
    mutationFn: async (conversationId: string) => {
      const response = await apiRequest("DELETE", `/api/chat/conversations/${conversationId}`, {});
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/chat/conversations/${userId}`] });
      if (selectedConversationId) {
        setSelectedConversationId(null);
      }
      toast({
        title: "Conversation deleted",
        description: "The conversation has been permanently removed.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete conversation. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Auto-select first conversation on load
  useEffect(() => {
    if (conversations && conversations.length > 0 && !selectedConversationId) {
      setSelectedConversationId(conversations[0].id);
    }
  }, [conversations, selectedConversationId]);

  const handleSendMessage = (content: string) => {
    if (!selectedConversationId) {
      // Create new conversation first
      createConversationMutation.mutate();
      return;
    }

    sendMessageMutation.mutate({
      conversationId: selectedConversationId,
      content
    });
  };

  const handleNewChat = () => {
    createConversationMutation.mutate();
  };

  const handleDeleteConversation = (conversationId: string) => {
    if (confirm("Are you sure you want to delete this conversation? This action cannot be undone.")) {
      deleteConversationMutation.mutate(conversationId);
    }
  };

  // Enhanced Header handlers for chat mode
  const handleEmergencyClick = () => {
    toast({
      title: "Emergency Support",
      description: "Connecting you to crisis support resources...",
      variant: "destructive",
    });
    // In a real app, this would redirect to emergency resources or open a crisis chat
    setLocation("/emergency");
  };

  const handleNavigateBack = () => {
    setLocation("/");
  };

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleSettingsChange = (setting: string, value: any) => {
    switch (setting) {
      case 'language':
        setSelectedLanguage(value);
        toast({
          title: "Language Updated",
          description: `Interface language changed to ${value}`,
        });
        break;
      case 'sound':
        setIsSoundEnabled(value);
        toast({
          title: value ? "Sound Enabled" : "Sound Disabled",
          description: `Chat sound effects ${value ? 'enabled' : 'disabled'}`,
        });
        break;
      case 'notifications':
        setIsNotificationsEnabled(value);
        toast({
          title: value ? "Notifications Enabled" : "Notifications Disabled", 
          description: `Push notifications ${value ? 'enabled' : 'disabled'}`,
        });
        break;
    }
  };

  const handleToggleAnonymousMode = (enabled: boolean) => {
    setIsAnonymousMode(enabled);
    toast({
      title: enabled ? "Anonymous Mode Enabled" : "Anonymous Mode Disabled",
      description: enabled 
        ? "Your identity is now hidden for maximum privacy" 
        : "Your profile is now visible",
    });
  };

  const handleProfileClick = () => {
    toast({
      title: "Profile Settings",
      description: "Opening profile configuration...",
    });
    // In a real app, this would open a profile modal or navigate to profile page
  };

  const handleLogout = () => {
    toast({
      title: "Logged Out",
      description: "You have been safely logged out",
    });
    setLocation("/");
  };

  // Mock user data for demonstration
  const currentUser = {
    id: userId,
    username: "student_user",
    firstName: "Student", 
    email: "student@university.edu"
  };

  // Connection status mapping from WebSocket state
  const getConnectionStatus = () => {
    switch (connectionState) {
      case 'connected': return 'connected';
      case 'connecting': return 'connecting';
      case 'reconnecting': return 'reconnecting';
      case 'disconnected': return 'disconnected';
      default: return 'disconnected';
    }
  };

  // Connection quality (mock - in real app would be based on latency, etc.)
  const getConnectionQuality = () => {
    const status = getConnectionStatus();
    if (status === 'connected') return 'excellent';
    if (status === 'connecting' || status === 'reconnecting') return 'good';
    return 'disconnected';
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        // Enable chat mode with all enhanced features
        isChatMode={true}
        
        // AI Status Display
        aiModel="Gemini Pro"
        connectionStatus={getConnectionStatus()}
        connectionQuality={getConnectionQuality()}
        
        // Navigation
        onNavigateBack={handleNavigateBack}
        
        // Emergency Support
        onEmergencyClick={handleEmergencyClick}
        
        // User Profile & Authentication
        currentUser={currentUser}
        isAnonymousMode={isAnonymousMode}
        onToggleAnonymousMode={handleToggleAnonymousMode}
        onProfileClick={handleProfileClick}
        onLogout={handleLogout}
        
        // Settings & Preferences
        selectedLanguage={selectedLanguage}
        isSoundEnabled={isSoundEnabled}
        isNotificationsEnabled={isNotificationsEnabled}
        onSettingsChange={handleSettingsChange}
        
        // Fullscreen Mode
        isFullscreen={isFullscreen}
        onToggleFullscreen={handleToggleFullscreen}
      />
      
      <div className="pt-20 h-screen flex">
        <ChatSidebar
          userId={userId}
          selectedConversationId={selectedConversationId}
          conversations={conversations}
          conversationsLoading={conversationsLoading}
          connectionState={connectionState}
          onConversationSelect={(id) => {
            setSelectedConversationId(id);
            setIsMobileSidebarOpen(false);
          }}
          onNewConversation={handleNewChat}
          onDeleteConversation={handleDeleteConversation}
          isOpen={isMobileSidebarOpen}
          onOpenChange={setIsMobileSidebarOpen}
        />

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedConversationId ? (
            <ChatInterface
              conversationId={selectedConversationId}
              messages={messages}
              isLoading={messagesLoading}
              onSendMessage={handleSendMessage}
              isSending={sendMessageMutation.isPending}
              onToggleSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
            />
          ) : (
            <WelcomeScreen onNewChat={handleNewChat} />
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Welcome Screen - Shown when no conversation is selected
 */
function WelcomeScreen({ onNewChat }: { onNewChat: () => void }) {
  const features = [
    {
      icon: Brain,
      title: "Empathetic AI Support",
      description: "Get instant, compassionate responses to your mental health concerns"
    },
    {
      icon: Lock,
      title: "100% Confidential",
      description: "Your conversations are private and securely encrypted"
    },
    {
      icon: Calendar,
      title: "24/7 Availability",
      description: "Support is available whenever you need it most"
    },
    {
      icon: BookOpen,
      title: "Evidence-Based",
      description: "Responses based on proven mental health techniques"
    }
  ];

  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="max-w-2xl text-center space-y-8">
        <div className="space-y-4">
          <div className="w-24 h-24 gradient-primary rounded-full flex items-center justify-center mx-auto">
            <MessageCircle className="text-white" size={40} />
          </div>
          <h1 className="text-3xl font-bold text-foreground font-heading">Welcome to MindCare AI</h1>
          <p className="text-xl text-muted-foreground">
            Your compassionate AI companion for mental health support
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card key={index} className="text-left">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <IconComponent className="text-primary" size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="space-y-4">
          <Button 
            size="lg" 
            onClick={onNewChat}
            className="gradient-primary text-white px-8"
            data-testid="button-start-conversation"
          >
            <MessageCircle className="mr-2" size={20} />
            Start Your First Conversation
          </Button>
          
          <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <AlertTriangle size={14} className="text-destructive" />
              <span>Crisis situations? Visit our</span>
              <Button variant="link" className="h-auto p-0 text-destructive" asChild>
                <a href="/emergency">Emergency Help</a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
