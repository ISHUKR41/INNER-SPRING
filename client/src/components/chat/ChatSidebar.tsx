import { useState, useEffect, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger,
  SheetDescription 
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { 
  MessageCircle, Plus, Search, Star, Archive, Trash2, Download, 
  Settings, Lock, Calendar, BookOpen, Users, Brain, Timer,
  Filter, Pin, Menu, ChevronDown, Smile, Heart, Zap, 
  Frown, Meh, AlertTriangle, Clock, MessageSquare, Volume2,
  Shield, Database, Share, User, ArrowUp, ArrowDown, Palette
} from "lucide-react";
import { useChatWebSocket } from "@/hooks/use-websocket";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useMobile } from "@/hooks/use-mobile";
import type { ChatConversation, ChatMessage, User } from "@/types";

// Mood options for tracking emotional state
const MOOD_OPTIONS = [
  { emoji: "😊", label: "Excellent", value: "excellent", color: "text-green-500" },
  { emoji: "🙂", label: "Good", value: "good", color: "text-blue-500" },
  { emoji: "😐", label: "Neutral", value: "neutral", color: "text-gray-500" },
  { emoji: "😔", label: "Low", value: "low", color: "text-orange-500" },
  { emoji: "😢", label: "Very Low", value: "very_low", color: "text-red-500" }
];

// Topic starters for mental health conversations
const TOPIC_STARTERS = [
  { label: "Feeling Anxious", icon: AlertTriangle, category: "anxiety" },
  { label: "Sleep Issues", icon: Clock, category: "sleep" },
  { label: "Academic Stress", icon: BookOpen, category: "academic" },
  { label: "Need Support", icon: Heart, category: "emotional" },
];

// Filter options for conversation organization
const FILTER_OPTIONS = [
  { label: "All Conversations", value: "all" },
  { label: "Pinned", value: "pinned" },
  { label: "Anxiety", value: "anxiety" },
  { label: "Depression", value: "depression" },
  { label: "Academic", value: "academic" },
  { label: "Crisis", value: "crisis" },
  { label: "Wellness", value: "wellness" },
];

interface ChatSidebarProps {
  userId: string;
  selectedConversationId: string | null;
  conversations: ChatConversation[];
  conversationsLoading: boolean;
  connectionState: 'connected' | 'connecting' | 'disconnected';
  onConversationSelect: (id: string) => void;
  onNewConversation: () => void;
  onDeleteConversation: (id: string) => void;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

/**
 * Comprehensive left sidebar component for mental health chat platform
 * Features user profile, mood tracking, conversation management, and quick actions
 */
export default function ChatSidebar({
  userId,
  selectedConversationId,
  conversations,
  conversationsLoading,
  connectionState,
  onConversationSelect,
  onNewConversation,
  onDeleteConversation,
  isOpen = false,
  onOpenChange
}: ChatSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterBy, setFilterBy] = useState("all");
  const [showSettings, setShowSettings] = useState(false);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [anonymousMode, setAnonymousMode] = useState(false);
  const [autoDeleteDays, setAutoDeleteDays] = useState("never");
  
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const isMobile = useMobile();

  // Fetch user profile data for enhanced sidebar features
  const { data: userProfile } = useQuery<User>({
    queryKey: [`/api/users/${userId}`],
    enabled: !!userId,
  });

  // Update mood mutation
  const updateMoodMutation = useMutation({
    mutationFn: async (mood: string) => {
      const response = await apiRequest("PATCH", `/api/users/${userId}/mood`, { mood });
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/users/${userId}`] });
      toast({
        title: "Mood updated",
        description: "Your emotional state has been recorded.",
      });
    }
  });

  // Pin conversation mutation
  const pinConversationMutation = useMutation({
    mutationFn: async ({ conversationId, pinned }: { conversationId: string; pinned: boolean }) => {
      const response = await apiRequest("PATCH", `/api/chat/conversations/${conversationId}`, { pinned });
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/chat/conversations/${userId}`] });
    }
  });

  // Archive conversation mutation  
  const archiveConversationMutation = useMutation({
    mutationFn: async ({ conversationId, archived }: { conversationId: string; archived: boolean }) => {
      const response = await apiRequest("PATCH", `/api/chat/conversations/${conversationId}`, { archived });
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/chat/conversations/${userId}`] });
    }
  });

  // Filtered and searched conversations
  const filteredConversations = useMemo(() => {
    let filtered = conversations.filter(conv => {
      // Apply search filter
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();
        const titleMatch = conv.title?.toLowerCase().includes(searchLower);
        // Note: In a real implementation, you'd also search message content
        if (!titleMatch) return false;
      }
      
      // Apply category filter
      if (filterBy === "pinned") return conv.pinned;
      if (filterBy !== "all") return conv.category === filterBy;
      
      return !conv.archived; // Hide archived by default
    });

    // Sort conversations: pinned first, then by last message time
    return filtered.sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
  }, [conversations, searchQuery, filterBy]);

  // Handle mood update
  const handleMoodUpdate = (mood: string) => {
    setSelectedMood(mood);
    updateMoodMutation.mutate(mood);
  };

  // Handle conversation pin/unpin
  const handlePinConversation = (conversationId: string, currentPinned: boolean) => {
    pinConversationMutation.mutate({ conversationId, pinned: !currentPinned });
  };

  // Handle conversation archive
  const handleArchiveConversation = (conversationId: string) => {
    archiveConversationMutation.mutate({ conversationId, archived: true });
  };

  // Start conversation with topic
  const handleTopicStarter = (category: string) => {
    onNewConversation();
    // Note: In a real implementation, you'd pre-populate with category-specific message
  };

  // Export conversation data
  const handleExportConversation = async (conversationId: string) => {
    try {
      const response = await apiRequest("GET", `/api/chat/export/${conversationId}`, {});
      const data = await response.blob();
      const url = window.URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = `conversation-${conversationId}.json`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast({
        title: "Export failed",
        description: "Unable to export conversation data.",
        variant: "destructive"
      });
    }
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-card">
      {/* User Profile Section */}
      <div className="p-6 border-b border-border/50">
        <div className="flex items-center space-x-3 mb-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src="" />
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {userProfile?.firstName?.[0] || userProfile?.username?.[0]?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground truncate" data-testid="text-username">
              {anonymousMode ? "Anonymous User" : (userProfile?.firstName || userProfile?.username || "User")}
            </h3>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${
                connectionState === 'connected' ? 'bg-green-500' : 
                connectionState === 'connecting' ? 'bg-yellow-500' : 'bg-red-500'
              }`}></div>
              <span className="text-xs text-muted-foreground">
                {connectionState === 'connected' ? 'Online' : 
                 connectionState === 'connecting' ? 'Connecting...' : 'Offline'}
              </span>
            </div>
          </div>
        </div>

        {/* Mood Tracking */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">Current Mood</span>
            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm"
                  data-testid="button-mood-selector"
                  className="h-8 px-3"
                >
                  {selectedMood ? (
                    <span className="flex items-center space-x-1">
                      <span>{MOOD_OPTIONS.find(m => m.value === selectedMood)?.emoji}</span>
                      <span className="text-xs">{MOOD_OPTIONS.find(m => m.value === selectedMood)?.label}</span>
                    </span>
                  ) : (
                    <span className="flex items-center space-x-1">
                      <Smile size={14} />
                      <span className="text-xs">Set Mood</span>
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-3">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">How are you feeling?</h4>
                  <div className="grid grid-cols-1 gap-2">
                    {MOOD_OPTIONS.map((mood) => (
                      <Button
                        key={mood.value}
                        variant={selectedMood === mood.value ? "default" : "ghost"}
                        size="sm"
                        onClick={() => handleMoodUpdate(mood.value)}
                        className="justify-start h-auto py-2"
                        data-testid={`button-mood-${mood.value}`}
                      >
                        <span className="text-lg mr-2">{mood.emoji}</span>
                        <span className="text-sm">{mood.label}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* Anonymous Mode Toggle */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-sm font-medium text-foreground">Anonymous Mode</span>
              <p className="text-xs text-muted-foreground">Hide your identity in conversations</p>
            </div>
            <Switch 
              checked={anonymousMode}
              onCheckedChange={setAnonymousMode}
              data-testid="switch-anonymous-mode"
            />
          </div>
        </div>
      </div>

      {/* Chat History Management */}
      <div className="p-4 border-b border-border/50 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-foreground">Conversations</h3>
          <Button 
            size="sm"
            onClick={onNewConversation}
            data-testid="button-new-conversation"
            className="h-8 px-3"
          >
            <Plus size={14} className="mr-1" />
            New
          </Button>
        </div>

        {/* Topic Starters */}
        <div className="space-y-2">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Quick Start</span>
          <div className="grid grid-cols-2 gap-2">
            {TOPIC_STARTERS.map((topic) => {
              const IconComponent = topic.icon;
              return (
                <Button
                  key={topic.category}
                  variant="outline"
                  size="sm"
                  onClick={() => handleTopicStarter(topic.category)}
                  className="h-auto py-2 px-2 text-xs"
                  data-testid={`button-topic-${topic.category}`}
                >
                  <IconComponent size={12} className="mr-1" />
                  {topic.label}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Search and Filter */}
        <div className="space-y-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={14} />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-8 text-sm"
              data-testid="input-conversation-search"
            />
          </div>
          
          <Select value={filterBy} onValueChange={setFilterBy}>
            <SelectTrigger className="h-8 text-sm" data-testid="select-conversation-filter">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {FILTER_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Conversation List */}
      <ScrollArea className="flex-1 px-4">
        <div className="space-y-2 py-4">
          {conversationsLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-16 bg-muted rounded-lg"></div>
                </div>
              ))}
            </div>
          ) : filteredConversations.length > 0 ? (
            filteredConversations.map((conversation) => (
              <ConversationCard
                key={conversation.id}
                conversation={conversation}
                isSelected={selectedConversationId === conversation.id}
                onSelect={() => onConversationSelect(conversation.id)}
                onPin={(pinned) => handlePinConversation(conversation.id, pinned)}
                onArchive={() => handleArchiveConversation(conversation.id)}
                onDelete={() => onDeleteConversation(conversation.id)}
                onExport={() => handleExportConversation(conversation.id)}
              />
            ))
          ) : (
            <div className="text-center py-8">
              <MessageCircle className="mx-auto text-muted-foreground mb-3" size={32} />
              <p className="text-sm text-muted-foreground">No conversations found</p>
              {searchQuery && (
                <Button 
                  variant="link" 
                  size="sm"
                  onClick={() => setSearchQuery("")}
                  className="mt-2"
                >
                  Clear search
                </Button>
              )}
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Quick Actions Panel */}
      <div className="p-4 border-t border-border/50 space-y-3">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Quick Actions</span>
        <div className="grid grid-cols-2 gap-2">
          <Button 
            variant="outline" 
            size="sm"
            asChild
            className="h-auto py-2 px-2 text-xs"
            data-testid="button-assessments"
          >
            <a href="/assessments">
              <Brain size={12} className="mr-1" />
              Assessments
            </a>
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            asChild
            className="h-auto py-2 px-2 text-xs"
            data-testid="button-appointments"
          >
            <a href="/appointments">
              <Calendar size={12} className="mr-1" />
              Book Session
            </a>
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            asChild
            className="h-auto py-2 px-2 text-xs"
            data-testid="button-resources"
          >
            <a href="/resources">
              <BookOpen size={12} className="mr-1" />
              Resources
            </a>
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            asChild
            className="h-auto py-2 px-2 text-xs"
            data-testid="button-peer-support"
          >
            <a href="/peer-support">
              <Users size={12} className="mr-1" />
              Community
            </a>
          </Button>
        </div>
      </div>

      {/* Privacy & Settings */}
      <div className="p-4 border-t border-border/50">
        <Dialog open={showSettings} onOpenChange={setShowSettings}>
          <DialogTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full justify-start"
              data-testid="button-chat-settings"
            >
              <Settings size={14} className="mr-2" />
              Privacy & Settings
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Chat Settings</DialogTitle>
              <DialogDescription>
                Manage your privacy preferences and data settings
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-sm font-medium">Auto-delete Conversations</span>
                    <p className="text-xs text-muted-foreground">Automatically remove old conversations</p>
                  </div>
                </div>
                <Select value={autoDeleteDays} onValueChange={setAutoDeleteDays}>
                  <SelectTrigger data-testid="select-auto-delete">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="never">Never</SelectItem>
                    <SelectItem value="30">After 30 days</SelectItem>
                    <SelectItem value="90">After 90 days</SelectItem>
                    <SelectItem value="365">After 1 year</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="space-y-3">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start"
                  data-testid="button-export-data"
                >
                  <Download size={14} className="mr-2" />
                  Export All Data
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  asChild 
                  className="w-full justify-start"
                  data-testid="button-emergency-contacts"
                >
                  <a href="/emergency">
                    <Shield size={14} className="mr-2" />
                    Emergency Contacts
                  </a>
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Alert className="mt-3">
          <Lock className="h-4 w-4" />
          <AlertDescription className="text-xs">
            All conversations are encrypted and confidential
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );

  // Mobile responsive wrapper using Sheet
  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={onOpenChange}>
        <SheetTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon"
            className="fixed top-4 left-4 z-50 lg:hidden"
            data-testid="button-mobile-sidebar-trigger"
          >
            <Menu size={20} />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-80 p-0">
          <SheetHeader className="sr-only">
            <SheetTitle>Chat Sidebar</SheetTitle>
            <SheetDescription>Manage your conversations and settings</SheetDescription>
          </SheetHeader>
          <SidebarContent />
        </SheetContent>
      </Sheet>
    );
  }

  // Desktop/tablet fixed sidebar
  return (
    <div className="w-80 h-full border-r border-border bg-card">
      <SidebarContent />
    </div>
  );
}

/**
 * Individual conversation card component with rich metadata and actions
 */
interface ConversationCardProps {
  conversation: ChatConversation;
  isSelected: boolean;
  onSelect: () => void;
  onPin: (currentPinned: boolean) => void;
  onArchive: () => void;
  onDelete: () => void;
  onExport: () => void;
}

function ConversationCard({ 
  conversation, 
  isSelected, 
  onSelect, 
  onPin, 
  onArchive, 
  onDelete, 
  onExport 
}: ConversationCardProps) {
  const [showActions, setShowActions] = useState(false);

  const getMoodColor = (category?: string) => {
    switch (category) {
      case 'anxiety': return 'text-orange-500';
      case 'depression': return 'text-blue-500';
      case 'crisis': return 'text-red-500';
      case 'wellness': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const messageDate = new Date(date);
    const diffInHours = (now.getTime() - messageDate.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 168) { // Within a week
      return messageDate.toLocaleDateString([], { weekday: 'short' });
    } else {
      return messageDate.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  return (
    <Card 
      className={`cursor-pointer transition-all duration-200 hover:shadow-sm group ${
        isSelected 
          ? 'border-primary bg-primary/5 shadow-sm' 
          : 'border-border hover:border-primary/50'
      }`}
      onClick={onSelect}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      data-testid={`conversation-card-${conversation.id}`}
    >
      <CardContent className="p-3">
        <div className="space-y-2">
          {/* Header with title and actions */}
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-2 flex-1 min-w-0">
              {conversation.pinned && (
                <Pin size={12} className="text-primary flex-shrink-0" />
              )}
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${getMoodColor(conversation.category)}`} />
              <h4 className="font-medium text-sm text-foreground truncate">
                {conversation.title || "New Conversation"}
              </h4>
            </div>
            
            {(showActions || isSelected) && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => e.stopPropagation()}
                    data-testid={`button-conversation-actions-${conversation.id}`}
                  >
                    <ChevronDown size={12} />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-48 p-2" onClick={(e) => e.stopPropagation()}>
                  <div className="space-y-1">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => onPin(conversation.pinned || false)}
                      className="w-full justify-start"
                    >
                      <Pin size={14} className="mr-2" />
                      {conversation.pinned ? 'Unpin' : 'Pin'}
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={onArchive}
                      className="w-full justify-start"
                    >
                      <Archive size={14} className="mr-2" />
                      Archive
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={onExport}
                      className="w-full justify-start"
                    >
                      <Download size={14} className="mr-2" />
                      Export
                    </Button>
                    <Separator />
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={onDelete}
                      className="w-full justify-start text-destructive hover:text-destructive"
                    >
                      <Trash2 size={14} className="mr-2" />
                      Delete
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            )}
          </div>

          {/* Metadata */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center space-x-2">
              <span>{formatDate(conversation.updatedAt)}</span>
              {conversation.category && (
                <>
                  <span>•</span>
                  <Badge variant="secondary" className="text-xs px-1 py-0">
                    {conversation.category}
                  </Badge>
                </>
              )}
            </div>
            <div className="flex items-center space-x-1">
              <MessageSquare size={10} />
              <span>{conversation.messageCount || 0}</span>
            </div>
          </div>

          {/* Last message preview */}
          {conversation.lastMessage && (
            <p className="text-xs text-muted-foreground line-clamp-2">
              {conversation.lastMessage}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}