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
import { Progress } from "@/components/ui/progress";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { 
  MessageCircle, Plus, Search, Star, Archive, Trash2, Download, 
  Settings, Lock, Calendar, BookOpen, Users, Brain, Timer,
  Filter, Pin, Menu, ChevronDown, Smile, Heart, Zap, 
  Frown, Meh, AlertTriangle, Clock, MessageSquare, Volume2,
  Shield, Database, Share, User as UserIcon, ArrowUp, ArrowDown, 
  Palette, Activity, TrendingUp, Target, BarChart3, CheckCircle,
  XCircle, Edit, Copy, ExternalLink, MoreVertical, Eye, EyeOff,
  FileText, Headphones, Video, PlayCircle, Lightbulb, HelpCircle,
  Moon, GraduationCap, Coffee, Sunrise, Sunset, CloudRain,
  Sparkles, Flame, Snowflake, Wind, Sun, Loader2, Wifi,
  WifiOff, Signal, Phone, Shield as ShieldIcon, Bell, BellOff,
  Bookmark, Folder, FolderOpen, Hash, Grid, List, SortAsc,
  SortDesc, Calendar as CalendarIcon, UserPlus, UserMinus
} from "lucide-react";
import { useChatWebSocket } from "@/hooks/use-websocket";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import type { ChatConversation, ChatMessage, User } from "@/types";

// Enhanced mood options with more detailed emotional states
const MOOD_OPTIONS = [
  { emoji: "😊", label: "Excellent", value: "excellent", color: "text-green-500 bg-green-50 dark:bg-green-950/30", description: "Feeling great and positive" },
  { emoji: "🙂", label: "Good", value: "good", color: "text-blue-500 bg-blue-50 dark:bg-blue-950/30", description: "Generally feeling well" },
  { emoji: "😐", label: "Neutral", value: "neutral", color: "text-gray-500 bg-gray-50 dark:bg-gray-950/30", description: "Feeling okay, neither good nor bad" },
  { emoji: "😔", label: "Low", value: "low", color: "text-orange-500 bg-orange-50 dark:bg-orange-950/30", description: "Feeling down or discouraged" },
  { emoji: "😢", label: "Very Low", value: "very_low", color: "text-red-500 bg-red-50 dark:bg-red-950/30", description: "Struggling with difficult emotions" },
  { emoji: "😰", label: "Anxious", value: "anxious", color: "text-purple-500 bg-purple-50 dark:bg-purple-950/30", description: "Feeling worried or nervous" },
  { emoji: "😴", label: "Tired", value: "tired", color: "text-indigo-500 bg-indigo-50 dark:bg-indigo-950/30", description: "Feeling exhausted or drained" },
  { emoji: "😤", label: "Stressed", value: "stressed", color: "text-yellow-500 bg-yellow-50 dark:bg-yellow-950/30", description: "Feeling overwhelmed or pressured" }
];

// Enhanced topic starters with categories
const TOPIC_STARTERS = [
  { 
    label: "Anxiety Support", 
    icon: AlertTriangle, 
    category: "anxiety",
    description: "Feeling overwhelmed or anxious",
    color: "bg-purple-100 text-purple-700 dark:bg-purple-950/30 dark:text-purple-300"
  },
  { 
    label: "Sleep Help", 
    icon: Moon, 
    category: "sleep",
    description: "Having trouble sleeping or feeling tired",
    color: "bg-indigo-100 text-indigo-700 dark:bg-indigo-950/30 dark:text-indigo-300"
  },
  { 
    label: "Academic Stress", 
    icon: GraduationCap, 
    category: "academic",
    description: "Study pressure and academic challenges",
    color: "bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-300"
  },
  { 
    label: "Emotional Support", 
    icon: Heart, 
    category: "emotional",
    description: "Need someone to listen and understand",
    color: "bg-rose-100 text-rose-700 dark:bg-rose-950/30 dark:text-rose-300"
  },
  { 
    label: "Depression Help", 
    icon: Brain, 
    category: "depression",
    description: "Feeling low or hopeless",
    color: "bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:text-blue-300"
  },
  { 
    label: "Mindfulness", 
    icon: Sparkles, 
    category: "wellness",
    description: "Breathing exercises and relaxation",
    color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300"
  }
];

// Enhanced filter options for conversation organization
const FILTER_OPTIONS = [
  { label: "All Conversations", value: "all", icon: Grid },
  { label: "Pinned", value: "pinned", icon: Pin },
  { label: "Anxiety", value: "anxiety", icon: AlertTriangle },
  { label: "Depression", value: "depression", icon: Brain },
  { label: "Academic", value: "academic", icon: GraduationCap },
  { label: "Crisis", value: "crisis", icon: Phone },
  { label: "Wellness", value: "wellness", icon: Heart },
  { label: "Sleep", value: "sleep", icon: Moon },
  { label: "Archived", value: "archived", icon: Archive }
];

// Sort options for conversations
const SORT_OPTIONS = [
  { label: "Most Recent", value: "recent", icon: Clock },
  { label: "Alphabetical", value: "alphabetical", icon: SortAsc },
  { label: "Most Messages", value: "messages", icon: MessageSquare },
  { label: "Pinned First", value: "pinned", icon: Pin }
];

// Quick action items for mental health platform
const QUICK_ACTIONS = [
  {
    icon: ClipboardList,
    label: "Take Assessment",
    description: "Check your mental health status",
    href: "/assessments",
    color: "bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:text-blue-300"
  },
  {
    icon: Calendar,
    label: "Book Counseling",
    description: "Schedule with a professional",
    href: "/appointments", 
    color: "bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-300"
  },
  {
    icon: BookOpen,
    label: "Resources Library",
    description: "Browse helpful content",
    href: "/resources",
    color: "bg-purple-100 text-purple-700 dark:bg-purple-950/30 dark:text-purple-300"
  },
  {
    icon: Users,
    label: "Peer Support",
    description: "Connect with community",
    href: "/peer-support",
    color: "bg-rose-100 text-rose-700 dark:bg-rose-950/30 dark:text-rose-300"
  },
  {
    icon: BarChart3,
    label: "Progress Dashboard",
    description: "Track your journey",
    href: "/dashboard",
    color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300"
  },
  {
    icon: Phone,
    label: "Crisis Support",
    description: "Immediate help available",
    href: "/emergency",
    color: "bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-300"
  }
];

interface ChatSidebarProps {
  userId: string;
  selectedConversationId: string | null;
  conversations: ChatConversation[];
  conversationsLoading: boolean;
  connectionState: 'connected' | 'connecting' | 'disconnected' | 'error';
  onConversationSelect: (id: string) => void;
  onNewConversation: () => void;
  onDeleteConversation: (id: string) => void;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

/**
 * Comprehensive Mental Health Chat Sidebar Component
 * 
 * Features:
 * - Enhanced user profile with mood tracking and emotional state indicators
 * - Advanced chat history management with search, filter, and organization
 * - Conversation categorization by mental health topics
 * - Star/pin functionality with conversation previews
 * - Quick action panel for platform features
 * - Privacy controls and settings
 * - Responsive design for all device sizes
 * - Accessibility support
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
  const [sortBy, setSortBy] = useState("recent");
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [showSettings, setShowSettings] = useState(false);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [showMoodPicker, setShowMoodPicker] = useState(false);
  const [anonymousMode, setAnonymousMode] = useState(false);
  const [autoDeleteDays, setAutoDeleteDays] = useState("never");
  const [showArchivedConversations, setShowArchivedConversations] = useState(false);
  const [bulkSelectMode, setBulkSelectMode] = useState(false);
  const [selectedConversations, setSelectedConversations] = useState<string[]>([]);
  
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const isMobile = useIsMobile();

  // Fetch enhanced user profile data
  const { data: userProfile, isLoading: userProfileLoading } = useQuery<User>({
    queryKey: [`/api/users/${userId}`],
    enabled: !!userId,
  });

  // Fetch user's mood history for progress tracking
  const { data: moodHistory } = useQuery({
    queryKey: [`/api/users/${userId}/mood-history`],
    enabled: !!userId,
  });

  // Update mood mutation with enhanced tracking
  const updateMoodMutation = useMutation({
    mutationFn: async (mood: string) => {
      const response = await apiRequest("PATCH", `/api/users/${userId}/mood`, { 
        mood,
        timestamp: new Date().toISOString(),
        context: "chat_session"
      });
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/users/${userId}`] });
      queryClient.invalidateQueries({ queryKey: [`/api/users/${userId}/mood-history`] });
      toast({
        title: "Mood updated",
        description: "Your emotional state has been recorded for better support.",
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
      toast({
        title: "Conversation updated",
        description: "Conversation has been " + (pinConversationMutation.variables?.pinned ? "pinned" : "unpinned"),
      });
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
      toast({
        title: "Conversation " + (archiveConversationMutation.variables?.archived ? "archived" : "restored"),
        description: "Conversation has been moved to " + (archiveConversationMutation.variables?.archived ? "archive" : "active conversations"),
      });
    }
  });

  // Bulk operations mutation
  const bulkOperationMutation = useMutation({
    mutationFn: async ({ operation, conversationIds }: { operation: 'archive' | 'delete' | 'pin'; conversationIds: string[] }) => {
      const promises = conversationIds.map(id => {
        switch (operation) {
          case 'archive':
            return apiRequest("PATCH", `/api/chat/conversations/${id}`, { archived: true });
          case 'delete':
            return apiRequest("DELETE", `/api/chat/conversations/${id}`, {});
          case 'pin':
            return apiRequest("PATCH", `/api/chat/conversations/${id}`, { pinned: true });
          default:
            return Promise.resolve();
        }
      });
      await Promise.all(promises);
      return { operation, count: conversationIds.length };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [`/api/chat/conversations/${userId}`] });
      setBulkSelectMode(false);
      setSelectedConversations([]);
      toast({
        title: `Bulk ${data.operation} completed`,
        description: `${data.count} conversations have been ${data.operation}d`,
      });
    }
  });

  // Enhanced filtered and searched conversations
  const filteredConversations = useMemo(() => {
    let filtered = conversations.filter(conv => {
      // Apply search filter
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();
        const titleMatch = conv.title?.toLowerCase().includes(searchLower);
        const categoryMatch = conv.category?.toLowerCase().includes(searchLower);
        const messageMatch = conv.lastMessage?.toLowerCase().includes(searchLower);
        if (!titleMatch && !categoryMatch && !messageMatch) return false;
      }
      
      // Apply category filter
      if (filterBy === "pinned") return conv.pinned;
      if (filterBy === "archived") return conv.archived;
      if (filterBy !== "all") return conv.category === filterBy;
      
      return !conv.archived; // Hide archived by default unless specifically requested
    });

    // Apply sorting
    switch (sortBy) {
      case 'recent':
        filtered.sort((a, b) => {
          if (a.pinned && !b.pinned) return -1;
          if (!a.pinned && b.pinned) return 1;
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        });
        break;
      case 'alphabetical':
        filtered.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
        break;
      case 'messages':
        filtered.sort((a, b) => (b.messageCount || 0) - (a.messageCount || 0));
        break;
      case 'pinned':
        filtered.sort((a, b) => {
          if (a.pinned && !b.pinned) return -1;
          if (!a.pinned && b.pinned) return 1;
          return 0;
        });
        break;
    }

    return filtered;
  }, [conversations, searchQuery, filterBy, sortBy]);

  // Handle mood update with enhanced tracking
  const handleMoodUpdate = (mood: string) => {
    setSelectedMood(mood);
    setShowMoodPicker(false);
    updateMoodMutation.mutate(mood);
  };

  // Handle conversation pin/unpin
  const handleTogglePin = (conversationId: string, currentPinned: boolean) => {
    pinConversationMutation.mutate({ conversationId, pinned: !currentPinned });
  };

  // Handle conversation archive/restore
  const handleToggleArchive = (conversationId: string, currentArchived: boolean) => {
    archiveConversationMutation.mutate({ conversationId, archived: !currentArchived });
  };

  // Handle bulk operations
  const handleBulkOperation = (operation: 'archive' | 'delete' | 'pin') => {
    if (selectedConversations.length === 0) return;
    
    if (operation === 'delete') {
      const confirmDelete = confirm(`Are you sure you want to delete ${selectedConversations.length} conversations? This action cannot be undone.`);
      if (!confirmDelete) return;
    }
    
    bulkOperationMutation.mutate({ operation, conversationIds: selectedConversations });
  };

  // Toggle conversation selection for bulk operations
  const toggleConversationSelection = (conversationId: string) => {
    setSelectedConversations(prev => 
      prev.includes(conversationId) 
        ? prev.filter(id => id !== conversationId)
        : [...prev, conversationId]
    );
  };

  // Get connection status display
  const getConnectionDisplay = () => {
    switch (connectionState) {
      case 'connected':
        return { icon: Wifi, color: "text-green-500", text: "Connected" };
      case 'connecting':
        return { icon: Loader2, color: "text-yellow-500", text: "Connecting..." };
      case 'disconnected':
        return { icon: WifiOff, color: "text-red-500", text: "Disconnected" };
      default:
        return { icon: WifiOff, color: "text-gray-500", text: "Unknown" };
    }
  };

  const connectionDisplay = getConnectionDisplay();

  // Sidebar content component for reuse in mobile sheet and desktop sidebar
  const SidebarContent = () => (
    <div className="h-full flex flex-col bg-background">
      
      {/* Enhanced User Profile Section */}
      <div className="p-4 border-b border-border bg-card">
        <div className="space-y-4">
          
          {/* User Avatar and Basic Info */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              {userProfile && !anonymousMode ? (
                <Avatar className="h-12 w-12">
                  <AvatarImage src={userProfile.email ? `/api/avatar/${userProfile.email}` : undefined} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-lg font-semibold">
                    {userProfile.firstName?.[0] || userProfile.username?.[0] || 'U'}
                  </AvatarFallback>
                </Avatar>
              ) : (
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                  <UserIcon className="h-6 w-6 text-muted-foreground" />
                </div>
              )}
              
              {/* Online Status Indicator */}
              <div className={cn(
                "absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-background",
                connectionState === 'connected' ? "bg-green-500" : "bg-gray-400"
              )}></div>
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground truncate">
                {anonymousMode 
                  ? "Anonymous User" 
                  : (userProfile?.firstName || userProfile?.username || "User")
                }
              </h3>
              <div className="flex items-center space-x-2 text-sm">
                <connectionDisplay.icon 
                  className={cn("h-3 w-3", connectionDisplay.color)} 
                  {...(connectionState === 'connecting' && { className: cn("h-3 w-3 animate-spin", connectionDisplay.color) })}
                />
                <span className="text-muted-foreground text-xs">{connectionDisplay.text}</span>
                {userProfile?.preferredLanguage && (
                  <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                    {userProfile.preferredLanguage}
                  </Badge>
                )}
              </div>
            </div>

            {/* Profile Settings Button */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="ghost" className="h-8 w-8">
                  <Settings className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={() => setShowSettings(true)}>
                  <Settings className="h-4 w-4 mr-2" />
                  Chat Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setAnonymousMode(!anonymousMode)}>
                  {anonymousMode ? <Eye className="h-4 w-4 mr-2" /> : <EyeOff className="h-4 w-4 mr-2" />}
                  {anonymousMode ? "Exit Anonymous" : "Go Anonymous"}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Download className="h-4 w-4 mr-2" />
                  Export Chat History
                </DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear All Chats
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Enhanced Mood Tracking */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-foreground">How are you feeling?</h4>
              {userProfile?.currentMood && (
                <Badge variant="secondary" className="text-xs">
                  Last updated: {userProfile.lastMoodUpdate ? new Date(userProfile.lastMoodUpdate).toLocaleDateString() : 'Today'}
                </Badge>
              )}
            </div>
            
            <Popover open={showMoodPicker} onOpenChange={setShowMoodPicker}>
              <PopoverTrigger asChild>
                <Button 
                  variant="outline" 
                  className={cn(
                    "w-full justify-start h-auto p-3 transition-all duration-200",
                    userProfile?.currentMood && MOOD_OPTIONS.find(m => m.value === userProfile.currentMood)?.color
                  )}
                >
                  {userProfile?.currentMood ? (
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">
                        {MOOD_OPTIONS.find(m => m.value === userProfile.currentMood)?.emoji}
                      </span>
                      <div className="text-left">
                        <p className="font-medium">
                          {MOOD_OPTIONS.find(m => m.value === userProfile.currentMood)?.label}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {MOOD_OPTIONS.find(m => m.value === userProfile.currentMood)?.description}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Smile className="h-4 w-4" />
                      <span>Select your current mood</span>
                    </div>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-4" align="start">
                <div className="space-y-4">
                  <h4 className="font-semibold text-foreground">How are you feeling right now?</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {MOOD_OPTIONS.map((mood) => (
                      <Button
                        key={mood.value}
                        variant="outline"
                        className={cn(
                          "h-auto p-3 justify-start transition-all duration-200",
                          selectedMood === mood.value && mood.color,
                          userProfile?.currentMood === mood.value && "ring-2 ring-primary"
                        )}
                        onClick={() => handleMoodUpdate(mood.value)}
                        disabled={updateMoodMutation.isPending}
                      >
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{mood.emoji}</span>
                          <div className="text-left">
                            <p className="font-medium text-sm">{mood.label}</p>
                            <p className="text-xs text-muted-foreground">{mood.description}</p>
                          </div>
                        </div>
                      </Button>
                    ))}
                  </div>
                  
                  {/* Mood Progress Indicator */}
                  {moodHistory && (
                    <div className="pt-3 border-t border-border">
                      <p className="text-xs text-muted-foreground mb-2">Your mood this week</p>
                      <div className="flex items-center space-x-1">
                        {/* Simplified mood history visualization */}
                        {[...Array(7)].map((_, i) => (
                          <div key={i} className="w-4 h-4 rounded-full bg-muted"></div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* Session Information */}
          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="bg-muted/50 rounded-lg p-2">
              <p className="text-xs text-muted-foreground">Today's Sessions</p>
              <p className="font-semibold text-sm">2</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-2">
              <p className="text-xs text-muted-foreground">Total Messages</p>
              <p className="font-semibold text-sm">{conversations.reduce((acc, conv) => acc + (conv.messageCount || 0), 0)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* New Conversation and Topic Starters */}
      <div className="p-4 border-b border-border space-y-3">
        <Button 
          onClick={onNewConversation}
          className="w-full gradient-primary text-white font-medium h-11"
          data-testid="button-new-conversation"
        >
          <Plus className="h-4 w-4 mr-2" />
          Start New Conversation
        </Button>

        {/* Topic Starters */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">Quick Start Topics:</p>
          <div className="grid grid-cols-2 gap-2">
            {TOPIC_STARTERS.slice(0, 4).map((topic, index) => {
              const IconComponent = topic.icon;
              return (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className={cn("h-auto p-2 text-xs", topic.color)}
                  onClick={() => {
                    onNewConversation();
                    // In a real app, this would set the topic context
                  }}
                >
                  <IconComponent className="h-3 w-3 mr-1" />
                  {topic.label}
                </Button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Chat History Management */}
      <div className="flex-1 flex flex-col min-h-0">
        
        {/* Search and Filter Controls */}
        <div className="p-4 border-b border-border space-y-3">
          
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4"
              data-testid="input-search-conversations"
            />
          </div>

          {/* Filter and Sort Controls */}
          <div className="flex items-center space-x-2">
            <Select value={filterBy} onValueChange={setFilterBy}>
              <SelectTrigger className="flex-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FILTER_OPTIONS.map((option) => {
                  const IconComponent = option.icon;
                  return (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center space-x-2">
                        <IconComponent className="h-4 w-4" />
                        <span>{option.label}</span>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((option) => {
                  const IconComponent = option.icon;
                  return (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center space-x-2">
                        <IconComponent className="h-4 w-4" />
                        <span className="hidden sm:inline">{option.label}</span>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>

            {/* View Mode Toggle */}
            <div className="flex rounded-md border border-border">
              <Button
                size="sm"
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                className="h-8 w-8 p-0 rounded-r-none"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                className="h-8 w-8 p-0 rounded-l-none"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Bulk Actions */}
          {conversations.length > 0 && (
            <div className="flex items-center justify-between">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setBulkSelectMode(!bulkSelectMode)}
                className="text-xs"
              >
                {bulkSelectMode ? 'Cancel Selection' : 'Select Multiple'}
              </Button>
              
              {bulkSelectMode && selectedConversations.length > 0 && (
                <div className="flex items-center space-x-1">
                  <Button size="sm" variant="ghost" onClick={() => handleBulkOperation('pin')}>
                    <Pin className="h-3 w-3" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => handleBulkOperation('archive')}>
                    <Archive className="h-3 w-3" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => handleBulkOperation('delete')} className="text-destructive">
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Conversations List */}
        <ScrollArea className="flex-1 custom-scrollbar">
          <div className="space-y-1 p-2">
            {conversationsLoading ? (
              <ConversationSkeleton />
            ) : filteredConversations.length === 0 ? (
              <EmptyConversationsState 
                searchQuery={searchQuery}
                filterBy={filterBy}
                onNewConversation={onNewConversation}
                onClearSearch={() => setSearchQuery("")}
              />
            ) : (
              filteredConversations.map((conversation) => (
                <EnhancedConversationItem
                  key={conversation.id}
                  conversation={conversation}
                  isSelected={selectedConversationId === conversation.id}
                  isSelecting={bulkSelectMode}
                  isChecked={selectedConversations.includes(conversation.id)}
                  viewMode={viewMode}
                  onSelect={onConversationSelect}
                  onTogglePin={handleTogglePin}
                  onToggleArchive={handleToggleArchive}
                  onDelete={onDeleteConversation}
                  onToggleCheck={toggleConversationSelection}
                />
              ))
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Quick Actions Panel */}
      <div className="p-4 border-t border-border bg-muted/30">
        <div className="space-y-3">
          <p className="text-xs font-medium text-muted-foreground">Quick Actions</p>
          <div className="grid grid-cols-2 gap-2">
            {QUICK_ACTIONS.slice(0, 4).map((action, index) => {
              const IconComponent = action.icon;
              return (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className={cn("h-auto p-2 text-xs justify-start", action.color)}
                  asChild
                >
                  <a href={action.href}>
                    <IconComponent className="h-3 w-3 mr-1" />
                    <span className="truncate">{action.label}</span>
                  </a>
                </Button>
              );
            })}
          </div>
          
          {/* View All Actions */}
          <Button variant="ghost" size="sm" className="w-full text-xs" asChild>
            <a href="/dashboard">
              <MoreVertical className="h-3 w-3 mr-1" />
              View All Features
            </a>
          </Button>
        </div>
      </div>
    </div>
  );

  // Mobile implementation with sheet
  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={onOpenChange}>
        <SheetContent side="left" className="w-80 p-0">
          <SidebarContent />
        </SheetContent>
      </Sheet>
    );
  }

  // Desktop sidebar
  return (
    <div className="w-80 border-r border-border bg-card">
      <SidebarContent />
    </div>
  );
}

/**
 * Enhanced Conversation Item Component
 */
interface ConversationItemProps {
  conversation: ChatConversation;
  isSelected: boolean;
  isSelecting: boolean;
  isChecked: boolean;
  viewMode: 'list' | 'grid';
  onSelect: (id: string) => void;
  onTogglePin: (id: string, pinned: boolean) => void;
  onToggleArchive: (id: string, archived: boolean) => void;
  onDelete: (id: string) => void;
  onToggleCheck: (id: string) => void;
}

function EnhancedConversationItem({
  conversation,
  isSelected,
  isSelecting,
  isChecked,
  viewMode,
  onSelect,
  onTogglePin,
  onToggleArchive,
  onDelete,
  onToggleCheck
}: ConversationItemProps) {
  const [showActions, setShowActions] = useState(false);
  
  // Get category styling
  const getCategoryStyle = (category?: string) => {
    switch (category) {
      case 'anxiety':
        return "border-l-purple-500 bg-purple-50/50 dark:bg-purple-950/20";
      case 'depression':
        return "border-l-blue-500 bg-blue-50/50 dark:bg-blue-950/20";
      case 'academic':
        return "border-l-green-500 bg-green-50/50 dark:bg-green-950/20";
      case 'crisis':
        return "border-l-red-500 bg-red-50/50 dark:bg-red-950/20";
      case 'wellness':
        return "border-l-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20";
      case 'sleep':
        return "border-l-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20";
      default:
        return "border-l-gray-300 dark:border-l-gray-600";
    }
  };

  // Format last message time
  const formatTime = (date: Date) => {
    const now = new Date();
    const messageDate = new Date(date);
    const diffInHours = (now.getTime() - messageDate.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${Math.floor(diffInHours)}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return messageDate.toLocaleDateString();
  };

  // Get category icon
  const getCategoryIcon = (category?: string) => {
    switch (category) {
      case 'anxiety': return AlertTriangle;
      case 'depression': return Brain;
      case 'academic': return GraduationCap;
      case 'crisis': return Phone;
      case 'wellness': return Heart;
      case 'sleep': return Moon;
      default: return MessageCircle;
    }
  };

  const CategoryIcon = getCategoryIcon(conversation.category);

  return (
    <Card 
      className={cn(
        "cursor-pointer transition-all duration-200 border-l-4 hover:shadow-md",
        isSelected && "ring-2 ring-primary bg-primary/5",
        conversation.pinned && "bg-yellow-50/50 dark:bg-yellow-950/20",
        getCategoryStyle(conversation.category)
      )}
      onClick={() => !isSelecting && onSelect(conversation.id)}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <CardContent className="p-3">
        <div className="flex items-start space-x-3">
          
          {/* Selection Checkbox */}
          {isSelecting && (
            <div className="pt-1">
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => onToggleCheck(conversation.id)}
                className="rounded border-border"
              />
            </div>
          )}

          {/* Category Icon */}
          <div className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
            conversation.category === 'crisis' ? "bg-red-100 text-red-600 dark:bg-red-950/30 dark:text-red-400" :
            conversation.category === 'anxiety' ? "bg-purple-100 text-purple-600 dark:bg-purple-950/30 dark:text-purple-400" :
            conversation.category === 'depression' ? "bg-blue-100 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400" :
            conversation.category === 'academic' ? "bg-green-100 text-green-600 dark:bg-green-950/30 dark:text-green-400" :
            "bg-muted text-muted-foreground"
          )}>
            <CategoryIcon className="h-4 w-4" />
          </div>

          {/* Conversation Content */}
          <div className="flex-1 min-w-0">
            
            {/* Title and Metadata */}
            <div className="flex items-start justify-between">
              <div className="min-w-0 flex-1">
                <div className="flex items-center space-x-2">
                  <h4 className="font-medium text-sm text-foreground truncate">
                    {conversation.title || "New Conversation"}
                  </h4>
                  
                  {/* Conversation Badges */}
                  <div className="flex items-center space-x-1">
                    {conversation.pinned && (
                      <Pin className="h-3 w-3 text-yellow-600 dark:text-yellow-400" />
                    )}
                    {conversation.category === 'crisis' && (
                      <Badge variant="destructive" className="text-xs px-1.5 py-0.5">
                        Crisis
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Last Message Preview */}
                <p className="text-xs text-muted-foreground truncate mt-1">
                  {conversation.lastMessage || "No messages yet"}
                </p>

                {/* Conversation Metadata */}
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{conversation.lastMessageAt ? formatTime(conversation.lastMessageAt) : formatTime(conversation.createdAt)}</span>
                    
                    {conversation.messageCount && conversation.messageCount > 0 && (
                      <>
                        <MessageSquare className="h-3 w-3" />
                        <span>{conversation.messageCount}</span>
                      </>
                    )}
                  </div>

                  {/* Category Badge */}
                  {conversation.category && (
                    <Badge variant="secondary" className="text-xs px-1.5 py-0.5 capitalize">
                      {conversation.category}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              {(showActions || isSelecting) && !isSelecting && (
                <div className="flex items-center space-x-1 ml-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="icon" variant="ghost" className="h-6 w-6">
                        <MoreVertical className="h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onTogglePin(conversation.id, conversation.pinned || false)}>
                        <Pin className="h-4 w-4 mr-2" />
                        {conversation.pinned ? 'Unpin' : 'Pin'} Conversation
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onToggleArchive(conversation.id, conversation.archived || false)}>
                        <Archive className="h-4 w-4 mr-2" />
                        {conversation.archived ? 'Restore' : 'Archive'} Conversation
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Share className="h-4 w-4 mr-2" />
                        Share Conversation
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Download className="h-4 w-4 mr-2" />
                        Export Conversation
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => onDelete(conversation.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Conversation
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Empty Conversations State Component
 */
interface EmptyStateProps {
  searchQuery: string;
  filterBy: string;
  onNewConversation: () => void;
  onClearSearch: () => void;
}

function EmptyConversationsState({ searchQuery, filterBy, onNewConversation, onClearSearch }: EmptyStateProps) {
  if (searchQuery) {
    return (
      <div className="text-center py-8 px-4">
        <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="font-semibold text-foreground mb-2">No conversations found</h3>
        <p className="text-sm text-muted-foreground mb-4">
          No conversations match "{searchQuery}"
        </p>
        <Button size="sm" variant="outline" onClick={onClearSearch}>
          Clear Search
        </Button>
      </div>
    );
  }

  if (filterBy !== 'all') {
    return (
      <div className="text-center py-8 px-4">
        <Folder className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="font-semibold text-foreground mb-2">No {filterBy} conversations</h3>
        <p className="text-sm text-muted-foreground mb-4">
          You haven't had any conversations in this category yet.
        </p>
        <Button size="sm" onClick={onNewConversation}>
          Start First Conversation
        </Button>
      </div>
    );
  }

  return (
    <div className="text-center py-8 px-4">
      <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
      <h3 className="font-semibold text-foreground mb-2">Welcome to MindCare AI</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Start your first conversation to begin your mental health journey with our AI assistant.
      </p>
      <Button onClick={onNewConversation} className="gradient-primary text-white">
        <Plus className="h-4 w-4 mr-2" />
        Start Your First Chat
      </Button>
    </div>
  );
}

/**
 * Conversation Loading Skeleton
 */
function ConversationSkeleton() {
  return (
    <div className="space-y-2">
      {[...Array(5)].map((_, i) => (
        <Card key={i} className="animate-pulse">
          <CardContent className="p-3">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-muted rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
                <div className="h-3 bg-muted rounded w-1/4"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}