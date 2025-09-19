import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Header from "@/components/layout/Header";
import ChatInterface from "./components/ChatInterface";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { 
  MessageCircle, 
  Plus, 
  Trash2, 
  Lock, 
  Settings,
  AlertTriangle,
  Calendar,
  BookOpen,
  Brain
} from "lucide-react";
import { useChatWebSocket } from "@/hooks/use-websocket";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { ChatConversation, ChatMessage } from "@/types";

/**
 * AI Chatbot Page - Real-time chat interface with conversation management
 * Features AI-powered mental health support with crisis detection
 */
export default function ChatBot() {
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Mock user ID - in production would come from auth context
  const userId = "mock-user-id";

  // Fetch user's conversations with proper typing and default empty array
  const { data: conversations = [], isLoading: conversationsLoading } = useQuery<ChatConversation[]>({
    queryKey: [`/api/chat/conversations/${userId}`],
    enabled: !!userId,
  });

  // Fetch messages for selected conversation with proper typing and default empty array
  const { data: messages = [], isLoading: messagesLoading } = useQuery<ChatMessage[]>({
    queryKey: [`/api/chat/messages/${selectedConversationId}`],
    enabled: !!selectedConversationId,
  });

  // WebSocket for real-time chat
  const { sendMessage: sendWsMessage, connectionState } = useChatWebSocket(
    selectedConversationId || "",
    (newMessage) => {
      // Update messages cache when new message received
      queryClient.setQueryData(
        [`/api/chat/messages/${selectedConversationId}`],
        (oldMessages: ChatMessage[] = []) => [...oldMessages, newMessage]
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
      // Update messages cache with both user and AI messages
      queryClient.setQueryData(
        [`/api/chat/messages/${selectedConversationId}`],
        (oldMessages: ChatMessage[] = []) => [...oldMessages, data.userMessage, data.aiMessage]
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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="pt-20 h-screen flex">
        {/* Sidebar - Chat History */}
        <div className={`
          ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
          lg:translate-x-0 fixed lg:relative z-30 w-80 h-full bg-card border-r border-border transition-transform duration-300
        `}>
          <div className="flex flex-col h-full">
            {/* Sidebar Header */}
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-foreground font-heading flex items-center">
                  <MessageCircle className="mr-2" size={24} />
                  AI Assistant
                </h2>
                <Button
                  size="sm"
                  onClick={handleNewChat}
                  disabled={createConversationMutation.isPending}
                  data-testid="button-new-chat"
                >
                  <Plus size={16} className="mr-1" />
                  New Chat
                </Button>
              </div>
              
              {/* Connection Status */}
              <div className="flex items-center space-x-2 text-sm">
                <div className={`w-2 h-2 rounded-full ${
                  connectionState === 'connected' ? 'bg-green-500' : 
                  connectionState === 'connecting' ? 'bg-yellow-500' : 'bg-red-500'
                }`}></div>
                <span className="text-muted-foreground">
                  {connectionState === 'connected' ? 'Connected' : 
                   connectionState === 'connecting' ? 'Connecting...' : 'Disconnected'}
                </span>
              </div>
            </div>

            {/* Chat History List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
              {conversationsLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-16 bg-muted rounded-lg"></div>
                    </div>
                  ))}
                </div>
              ) : conversations && conversations.length > 0 ? (
                <div className="space-y-2">
                  {conversations.map((conversation: ChatConversation) => (
                    <Card
                      key={conversation.id}
                      className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                        selectedConversationId === conversation.id 
                          ? 'border-primary bg-primary/5' 
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => {
                        setSelectedConversationId(conversation.id);
                        setIsMobileSidebarOpen(false);
                      }}
                      data-testid={`conversation-${conversation.id}`}
                    >
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-foreground truncate">
                              {conversation.title || "New Conversation"}
                            </h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              {new Date(conversation.updatedAt).toLocaleDateString()}
                            </p>
                          </div>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteConversation(conversation.id);
                            }}
                            data-testid={`button-delete-conversation-${conversation.id}`}
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <MessageCircle className="mx-auto text-muted-foreground mb-4" size={48} />
                  <p className="text-muted-foreground">No conversations yet</p>
                  <p className="text-sm text-muted-foreground mt-2">Start a new chat to begin</p>
                </div>
              )}
            </div>

            {/* Sidebar Footer */}
            <div className="p-4 border-t border-border space-y-4">
              <Alert>
                <Lock className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  All conversations are encrypted and confidential
                </AlertDescription>
              </Alert>
              
              <div className="flex space-x-2">
                <Button size="sm" variant="outline" className="flex-1" data-testid="button-chat-settings">
                  <Settings size={14} className="mr-1" />
                  Settings
                </Button>
              </div>
            </div>
          </div>
        </div>

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
