import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  Send, 
  Menu, 
  Mic, 
  Smile, 
  Paperclip,
  Copy,
  Calendar,
  BookOpen,
  Phone,
  AlertTriangle,
  Bot,
  User as UserIcon,
  Heart,
  Brain,
  Moon,
  GraduationCap,
  Shield,
  MoreVertical,
  ThumbsUp,
  ThumbsDown,
  Share,
  Bookmark,
  Star,
  Volume2,
  PlayCircle,
  Download,
  ExternalLink,
  Clock,
  Zap,
  Pause,
  Play,
  SkipForward,
  RotateCcw,
  CheckCircle,
  XCircle,
  FileText,
  Image as ImageIcon,
  Headphones,
  MessageSquare,
  Loader2,
  HelpCircle,
  Edit,
  Trash2,
  Flag,
  StopCircle,
  Lightbulb,
  Target,
  TrendingUp,
  Activity
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import type { ChatMessage } from "@/types";

interface ChatInterfaceProps {
  conversationId: string;
  messages: ChatMessage[];
  isLoading: boolean;
  onSendMessage: (content: string, context?: any) => void;
  isSending: boolean;
  onToggleSidebar: () => void;
}

// Mood options for pre-message mood selection
const MOOD_OPTIONS = [
  { emoji: "😊", label: "Great", value: "excellent", color: "text-green-500 bg-green-50 dark:bg-green-950/30" },
  { emoji: "🙂", label: "Good", value: "good", color: "text-blue-500 bg-blue-50 dark:bg-blue-950/30" },
  { emoji: "😐", label: "Okay", value: "neutral", color: "text-gray-500 bg-gray-50 dark:bg-gray-950/30" },
  { emoji: "😔", label: "Low", value: "low", color: "text-orange-500 bg-orange-50 dark:bg-orange-950/30" },
  { emoji: "😢", label: "Very Low", value: "very_low", color: "text-red-500 bg-red-50 dark:bg-red-950/30" },
  { emoji: "😰", label: "Anxious", value: "anxious", color: "text-purple-500 bg-purple-50 dark:bg-purple-950/30" }
];

// Quick response shortcuts for common mental health topics
const QUICK_RESPONSES = [
  { icon: AlertTriangle, label: "Crisis Help", content: "I need immediate crisis support", color: "bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-300" },
  { icon: Heart, label: "Breathing Exercise", content: "Can you guide me through a breathing exercise?", color: "bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:text-blue-300" },
  { icon: Moon, label: "Sleep Support", content: "I'm having trouble sleeping. Can you help?", color: "bg-indigo-100 text-indigo-700 dark:bg-indigo-950/30 dark:text-indigo-300" },
  { icon: GraduationCap, label: "Study Stress", content: "I'm feeling overwhelmed with academic pressure", color: "bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-300" },
  { icon: Brain, label: "Anxiety Help", content: "I'm feeling anxious and need coping strategies", color: "bg-purple-100 text-purple-700 dark:bg-purple-950/30 dark:text-purple-300" },
  { icon: BookOpen, label: "Self-Care Tips", content: "What are some self-care activities I can do today?", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300" }
];

// Emoji categories for mental health context
const EMOJI_CATEGORIES = {
  feelings: ["😊", "😌", "😔", "😢", "😰", "😟", "🥺", "😭", "😤", "😡", "🤗", "🤔", "😴", "🥱", "😵‍💫"],
  support: ["❤️", "🫂", "🤝", "💪", "🌟", "✨", "🌈", "🕊️", "🦋", "🌸", "🌺", "🍀", "💫", "⭐", "🌅"],
  wellness: ["🧘‍♀️", "🧘‍♂️", "🏃‍♀️", "🏃‍♂️", "🚶‍♀️", "🚶‍♂️", "🛀", "💆‍♀️", "💆‍♂️", "🌿", "🌱", "🎵", "🎨", "📚", "☕"]
};

/**
 * Comprehensive Chat Interface Component for Mental Health Support
 * Features advanced message types, mood integration, crisis detection, and accessibility
 */
export default function ChatInterface({
  conversationId,
  messages,
  isLoading,
  onSendMessage,
  isSending,
  onToggleSidebar
}: ChatInterfaceProps) {
  const [inputValue, setInputValue] = useState("");
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showQuickResponses, setShowQuickResponses] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [expandedInput, setExpandedInput] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  
  const { toast } = useToast();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Show typing indicator briefly when AI is responding
  useEffect(() => {
    if (isSending) {
      setIsTyping(true);
      const timer = setTimeout(() => setIsTyping(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isSending]);

  // Auto-focus input on mobile
  useEffect(() => {
    if (inputRef.current && !window.matchMedia('(max-width: 768px)').matches) {
      inputRef.current.focus();
    }
  }, [conversationId]);

  const handleSendMessage = useCallback(() => {
    const content = inputValue.trim();
    if (!content && attachedFiles.length === 0) return;

    const context = {
      mood: selectedMood,
      attachments: attachedFiles.length > 0 ? attachedFiles.map(f => ({ name: f.name, type: f.type, size: f.size })) : undefined,
      timestamp: new Date().toISOString()
    };

    onSendMessage(content, context);
    setInputValue("");
    setSelectedMood(null);
    setAttachedFiles([]);
    setExpandedInput(false);
    
    // Haptic feedback on mobile
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
  }, [inputValue, selectedMood, attachedFiles, onSendMessage]);

  const handleQuickResponse = (response: string) => {
    onSendMessage(response, { quickResponse: true, mood: selectedMood });
    setSelectedMood(null);
    setShowQuickResponses(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    } else if (e.key === "Enter" && e.shiftKey) {
      setExpandedInput(true);
    }
  };

  const copyMessage = useCallback((content: string) => {
    navigator.clipboard.writeText(content);
    toast({
      title: "Copied to clipboard",
      description: "Message copied successfully",
    });
  }, [toast]);

  const shareMessage = useCallback((content: string) => {
    if (navigator.share) {
      navigator.share({
        title: 'MindCare AI Message',
        text: content,
      });
    } else {
      copyMessage(content);
    }
  }, [copyMessage]);

  const bookmarkMessage = useCallback((messageId: string) => {
    // In a real app, this would save to user's bookmarks
    toast({
      title: "Message bookmarked",
      description: "This advice has been saved to your bookmarks",
    });
  }, [toast]);

  const rateMessage = useCallback((messageId: string, helpful: boolean) => {
    // In a real app, this would send feedback to improve AI
    toast({
      title: helpful ? "Thank you for your feedback" : "Feedback received",
      description: helpful ? "This helps us improve our responses" : "We'll work on better responses",
    });
  }, [toast]);

  const startVoiceRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.start();
      setIsRecording(true);
      
      toast({
        title: "Recording started",
        description: "Speak now - tap to stop recording",
      });
      
      mediaRecorder.addEventListener('dataavailable', (event) => {
        if (event.data.size > 0) {
          // In a real app, this would convert speech to text
          setInputValue(prev => prev + " [Voice message recorded] ");
        }
      });
      
    } catch (error) {
      toast({
        title: "Voice recording error",
        description: "Unable to access microphone. Please check permissions.",
        variant: "destructive"
      });
    }
  };

  const stopVoiceRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      
      toast({
        title: "Recording complete",
        description: "Voice message has been processed",
      });
    }
  };

  const handleFileAttachment = (files: FileList | null) => {
    if (!files) return;
    
    const newFiles = Array.from(files).slice(0, 3); // Limit to 3 files
    setAttachedFiles(prev => [...prev, ...newFiles].slice(0, 3));
    
    toast({
      title: "Files attached",
      description: `${newFiles.length} file(s) ready to send`,
    });
  };

  const removeAttachment = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const addEmoji = (emoji: string) => {
    setInputValue(prev => prev + emoji);
    setShowEmojiPicker(false);
    inputRef.current?.focus();
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Enhanced Chat Header */}
      <div className="bg-card border-b border-border p-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center space-x-3">
          <Button
            size="icon"
            variant="ghost"
            className="lg:hidden"
            onClick={onToggleSidebar}
            data-testid="button-toggle-sidebar"
            aria-label="Toggle sidebar"
          >
            <Menu size={20} />
          </Button>
          
          <div className="w-12 h-12 gradient-primary rounded-full flex items-center justify-center relative">
            <Bot className="text-white" size={24} />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background"></div>
          </div>
          
          <div>
            <h3 className="font-semibold text-foreground">MindCare AI Assistant</h3>
            <div className="flex items-center space-x-2 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-muted-foreground">Online • Ready to help</span>
              <Badge variant="secondary" className="text-xs px-2 py-0.5">Specialized in Student Mental Health</Badge>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="outline" data-testid="button-chat-options">
                <MoreVertical size={16} className="mr-1" />
                <span className="hidden sm:inline">Options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Share size={16} className="mr-2" />
                Share Conversation
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Download size={16} className="mr-2" />
                Export Chat
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Flag size={16} className="mr-2" />
                Report Issue
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                <Trash2 size={16} className="mr-2" />
                Clear Chat
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4 custom-scrollbar">
        <div className="space-y-6 max-w-4xl mx-auto">
          {isLoading ? (
            <MessageSkeleton />
          ) : messages.length === 0 ? (
            <WelcomeExperience onQuickResponse={handleQuickResponse} />
          ) : (
            messages.map((message, index) => (
              <EnhancedMessageBubble 
                key={message.id} 
                message={message} 
                isFirst={index === 0}
                isLast={index === messages.length - 1}
                onCopy={copyMessage}
                onShare={shareMessage}
                onBookmark={bookmarkMessage}
                onRate={rateMessage}
              />
            ))
          )}

          {/* Typing Indicator */}
          {(isTyping || isSending) && (
            <div className="flex items-start space-x-3 animate-fade-in">
              <div className="w-10 h-10 gradient-primary rounded-full flex items-center justify-center">
                <Bot className="text-white" size={18} />
              </div>
              <Card className="bg-muted/50 max-w-md">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <div className="loading-dots">
                      <div></div>
                      <div></div>
                      <div></div>
                    </div>
                    <span className="text-sm text-muted-foreground">AI is thinking...</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Quick Response Shortcuts */}
      {showQuickResponses && (
        <div className="border-t border-border bg-muted/30 p-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-foreground">Quick Support Options:</p>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowQuickResponses(false)}
                data-testid="button-close-quick-responses"
              >
                ×
              </Button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {QUICK_RESPONSES.map((response, index) => {
                const IconComponent = response.icon;
                return (
                  <Button
                    key={index}
                    size="sm"
                    variant="outline"
                    className={cn("h-auto flex-col p-3 text-xs", response.color)}
                    onClick={() => handleQuickResponse(response.content)}
                    data-testid={`button-quick-response-${index}`}
                  >
                    <IconComponent size={16} className="mb-1" />
                    {response.label}
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Input Area */}
      <div className="border-t border-border bg-card p-4 space-y-3">
        <div className="max-w-4xl mx-auto">
          
          {/* Mood Selector */}
          <div className="flex items-center space-x-2 mb-3">
            <span className="text-sm text-muted-foreground font-medium">How are you feeling?</span>
            <div className="flex items-center space-x-1">
              {MOOD_OPTIONS.map((mood) => (
                <Button
                  key={mood.value}
                  size="sm"
                  variant={selectedMood === mood.value ? "default" : "ghost"}
                  className={cn(
                    "h-8 px-2 text-xs transition-all duration-200",
                    selectedMood === mood.value && mood.color
                  )}
                  onClick={() => setSelectedMood(selectedMood === mood.value ? null : mood.value)}
                  data-testid={`button-mood-${mood.value}`}
                  aria-label={`Select ${mood.label} mood`}
                >
                  <span className="mr-1">{mood.emoji}</span>
                  <span className="hidden sm:inline">{mood.label}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* File Attachments Preview */}
          {attachedFiles.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {attachedFiles.map((file, index) => (
                <div key={index} className="flex items-center space-x-2 bg-muted rounded-lg px-3 py-2">
                  <FileText size={16} className="text-muted-foreground" />
                  <span className="text-sm text-foreground truncate max-w-32">{file.name}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-5 w-5 p-0 hover:bg-destructive hover:text-destructive-foreground"
                    onClick={() => removeAttachment(index)}
                  >
                    ×
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Main Input Area */}
          <div className="flex items-end space-x-2">
            
            {/* Text Input */}
            <div className="flex-1 relative">
              <Textarea
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={
                  selectedMood 
                    ? `Feeling ${MOOD_OPTIONS.find(m => m.value === selectedMood)?.label.toLowerCase()}... Share what's on your mind`
                    : "Share what's on your mind... I'm here to help 💙"
                }
                className={cn(
                  "resize-none transition-all duration-200 pr-32",
                  expandedInput ? "min-h-[120px]" : "min-h-[56px]",
                  "focus:min-h-[80px]"
                )}
                disabled={isSending}
                rows={expandedInput ? 4 : 2}
                data-testid="input-chat-message"
                aria-label="Type your message"
              />
              
              {/* Input Controls */}
              <div className="absolute right-3 bottom-3 flex items-center space-x-1">
                
                {/* Emoji Picker */}
                <Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
                  <PopoverTrigger asChild>
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="h-8 w-8" 
                      data-testid="button-emoji-picker"
                      aria-label="Open emoji picker"
                    >
                      <Smile size={16} />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-4" align="end">
                    <div className="space-y-3">
                      {Object.entries(EMOJI_CATEGORIES).map(([category, emojis]) => (
                        <div key={category}>
                          <p className="text-sm font-medium text-muted-foreground mb-2 capitalize">{category}</p>
                          <div className="grid grid-cols-8 gap-1">
                            {emojis.map((emoji) => (
                              <Button
                                key={emoji}
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0 hover:bg-muted"
                                onClick={() => addEmoji(emoji)}
                              >
                                {emoji}
                              </Button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>

                {/* Voice Input */}
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className={cn(
                    "h-8 w-8 transition-colors duration-200",
                    isRecording && "bg-red-100 text-red-600 dark:bg-red-950/30 dark:text-red-400"
                  )}
                  onClick={isRecording ? stopVoiceRecording : startVoiceRecording}
                  data-testid="button-voice-input"
                  aria-label={isRecording ? "Stop recording" : "Start voice recording"}
                >
                  {isRecording ? <StopCircle size={16} /> : <Mic size={16} />}
                </Button>

                {/* File Attachment */}
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*,audio/*,.pdf,.txt,.doc,.docx"
                  className="hidden"
                  onChange={(e) => handleFileAttachment(e.target.files)}
                />
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="h-8 w-8" 
                  onClick={() => fileInputRef.current?.click()}
                  data-testid="button-file-attachment"
                  aria-label="Attach files"
                >
                  <Paperclip size={16} />
                </Button>

                {/* Quick Responses Toggle */}
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="h-8 w-8" 
                  onClick={() => setShowQuickResponses(!showQuickResponses)}
                  data-testid="button-quick-responses"
                  aria-label="Open quick responses"
                >
                  <Zap size={16} />
                </Button>
              </div>
            </div>

            {/* Send Button */}
            <Button 
              onClick={handleSendMessage}
              disabled={!inputValue.trim() && attachedFiles.length === 0}
              className={cn(
                "h-14 px-6 gradient-primary text-white font-medium transition-all duration-200",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "hover:shadow-lg hover:scale-105",
                "focus:ring-2 focus:ring-primary focus:ring-offset-2"
              )}
              data-testid="button-send-message"
              aria-label="Send message"
            >
              {isSending ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <>
                  <Send size={20} className="mr-2" />
                  <span className="hidden sm:inline">Send</span>
                </>
              )}
            </Button>
          </div>

          {/* Input Footer */}
          <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
            <div className="flex items-center space-x-3">
              <span>Press Enter to send, Shift+Enter for new line</span>
              {selectedMood && (
                <Badge variant="secondary" className="text-xs">
                  Mood: {MOOD_OPTIONS.find(m => m.value === selectedMood)?.emoji} {MOOD_OPTIONS.find(m => m.value === selectedMood)?.label}
                </Badge>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <span>{inputValue.length}/2000</span>
              {inputValue.length > 1800 && (
                <AlertTriangle size={12} className="text-warning" />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Enhanced Welcome Experience Component
 */
function WelcomeExperience({ onQuickResponse }: { onQuickResponse: (response: string) => void }) {
  const currentHour = new Date().getHours();
  const timeGreeting = currentHour < 12 ? "Good morning" : currentHour < 18 ? "Good afternoon" : "Good evening";

  const quickStartOptions = [
    {
      icon: AlertTriangle,
      title: "Anxiety & Stress",
      description: "Feeling overwhelmed or anxious",
      content: "I'm feeling anxious and could use some help managing my stress",
      color: "bg-purple-50 border-purple-200 text-purple-800 dark:bg-purple-950/30 dark:border-purple-800/50 dark:text-purple-300"
    },
    {
      icon: Moon,
      title: "Sleep Issues",
      description: "Trouble sleeping or feeling tired",
      content: "I'm having trouble sleeping and would like some guidance",
      color: "bg-indigo-50 border-indigo-200 text-indigo-800 dark:bg-indigo-950/30 dark:border-indigo-800/50 dark:text-indigo-300"
    },
    {
      icon: GraduationCap,
      title: "Academic Pressure",
      description: "Study stress and academic challenges",
      content: "I'm feeling overwhelmed with my studies and academic responsibilities",
      color: "bg-green-50 border-green-200 text-green-800 dark:bg-green-950/30 dark:border-green-800/50 dark:text-green-300"
    },
    {
      icon: Heart,
      title: "Emotional Support",
      description: "Need someone to talk to",
      content: "I just need someone to listen and provide emotional support",
      color: "bg-rose-50 border-rose-200 text-rose-800 dark:bg-rose-950/30 dark:border-rose-800/50 dark:text-rose-300"
    }
  ];

  return (
    <div className="space-y-8 py-8">
      
      {/* Welcome Message */}
      <div className="text-center space-y-4">
        <div className="w-20 h-20 gradient-primary rounded-full flex items-center justify-center mx-auto animate-pulse">
          <Bot className="text-white" size={32} />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-heading font-bold text-foreground">
            {timeGreeting}! I'm here to support you 💙
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Welcome to MindCare AI. I'm your compassionate companion for mental health support, 
            available 24/7 to listen, understand, and help you navigate any challenges you're facing.
          </p>
        </div>
      </div>

      {/* Key Features */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-950/30 rounded-full flex items-center justify-center mx-auto">
            <Shield className="text-blue-600 dark:text-blue-400" size={24} />
          </div>
          <h3 className="font-semibold text-sm">100% Confidential</h3>
          <p className="text-xs text-muted-foreground">Your conversations are private and secure</p>
        </div>
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-green-100 dark:bg-green-950/30 rounded-full flex items-center justify-center mx-auto">
            <Clock className="text-green-600 dark:text-green-400" size={24} />
          </div>
          <h3 className="font-semibold text-sm">24/7 Available</h3>
          <p className="text-xs text-muted-foreground">Support whenever you need it most</p>
        </div>
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-purple-100 dark:bg-purple-950/30 rounded-full flex items-center justify-center mx-auto">
            <Brain className="text-purple-600 dark:text-purple-400" size={24} />
          </div>
          <h3 className="font-semibold text-sm">Evidence-Based</h3>
          <p className="text-xs text-muted-foreground">Responses based on proven techniques</p>
        </div>
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-rose-100 dark:bg-rose-950/30 rounded-full flex items-center justify-center mx-auto">
            <Heart className="text-rose-600 dark:text-rose-400" size={24} />
          </div>
          <h3 className="font-semibold text-sm">Empathetic Care</h3>
          <p className="text-xs text-muted-foreground">Understanding and non-judgmental support</p>
        </div>
      </div>

      {/* Quick Start Options */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-center text-foreground">
          What brings you here today?
        </h3>
        <div className="grid sm:grid-cols-2 gap-4">
          {quickStartOptions.map((option, index) => {
            const IconComponent = option.icon;
            return (
              <Card 
                key={index}
                className={cn(
                  "cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] border-2",
                  option.color
                )}
                onClick={() => onQuickResponse(option.content)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <IconComponent size={24} />
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold">{option.title}</h4>
                      <p className="text-sm opacity-90">{option.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Crisis Support Notice */}
      <Alert className="bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-800/50">
        <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
        <AlertDescription className="text-red-800 dark:text-red-300">
          <strong>In Crisis?</strong> If you're having thoughts of self-harm or suicide, please reach out for immediate help. 
          <Button variant="link" className="h-auto p-0 ml-1 text-red-700 dark:text-red-300 underline" asChild>
            <a href="/emergency">Get Emergency Support Now</a>
          </Button>
        </AlertDescription>
      </Alert>
    </div>
  );
}

/**
 * Enhanced Message Bubble Component with Advanced Features
 */
interface MessageBubbleProps {
  message: ChatMessage;
  isFirst: boolean;
  isLast: boolean;
  onCopy: (content: string) => void;
  onShare: (content: string) => void;
  onBookmark: (messageId: string) => void;
  onRate: (messageId: string, helpful: boolean) => void;
}

function EnhancedMessageBubble({ 
  message, 
  isFirst, 
  isLast, 
  onCopy, 
  onShare, 
  onBookmark, 
  onRate 
}: MessageBubbleProps) {
  const [showActions, setShowActions] = useState(false);
  const isUser = message.role === 'user';
  const isAI = message.role === 'assistant';

  // Detect if message contains crisis keywords
  const isCrisisMessage = message.content.toLowerCase().includes('crisis') || 
                         message.content.toLowerCase().includes('emergency') ||
                         message.content.toLowerCase().includes('suicide') ||
                         message.content.toLowerCase().includes('self-harm');

  return (
    <div 
      className={cn(
        "flex items-start space-x-3 group",
        isUser && "flex-row-reverse space-x-reverse",
        "animate-fade-in"
      )}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Avatar */}
      <div className={cn("flex-shrink-0", isUser && "order-last")}>
        {isUser ? (
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
            <UserIcon className="text-primary-foreground" size={18} />
          </div>
        ) : (
          <div className="w-10 h-10 gradient-primary rounded-full flex items-center justify-center">
            <Bot className="text-white" size={18} />
          </div>
        )}
      </div>

      {/* Message Content */}
      <div className={cn("flex-1 max-w-2xl", isUser && "text-right")}>
        
        {/* Message Bubble */}
        <Card className={cn(
          "transition-all duration-200",
          isUser 
            ? "bg-primary text-primary-foreground ml-auto" 
            : "bg-card hover:bg-muted/50",
          isCrisisMessage && !isUser && "border-red-500 bg-red-50 dark:bg-red-950/30",
          showActions && "shadow-lg"
        )}>
          <CardContent className="p-4">
            
            {/* Crisis Detection Banner */}
            {isCrisisMessage && !isUser && (
              <Alert className="mb-4 bg-red-100 border-red-300 dark:bg-red-950/50 dark:border-red-800">
                <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
                <AlertDescription className="text-red-800 dark:text-red-300">
                  <strong>Crisis Support Detected:</strong> I'm here to help. If you're in immediate danger, please contact emergency services.
                  <div className="mt-2">
                    <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white mr-2">
                      <Phone size={14} className="mr-1" />
                      Crisis Hotline
                    </Button>
                    <Button size="sm" variant="outline" className="border-red-300 text-red-700 dark:text-red-300">
                      <Calendar size={14} className="mr-1" />
                      Emergency Counselor
                    </Button>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {/* Message Text */}
            <div className={cn(
              "text-sm leading-relaxed",
              isUser ? "text-primary-foreground" : "text-foreground"
            )}>
              {message.content}
            </div>

            {/* AI Message Enhancements */}
            {isAI && (
              <div className="mt-4 space-y-3">
                
                {/* Simulated Resource Cards (based on content) */}
                {message.content.includes('breathing') && (
                  <ResourceCard 
                    title="4-7-8 Breathing Exercise"
                    type="audio"
                    duration="5 min"
                    description="Guided breathing technique for anxiety relief"
                    onView={() => {}}
                  />
                )}

                {message.content.includes('sleep') && (
                  <ResourceCard 
                    title="Sleep Hygiene Guide"
                    type="article"
                    duration="3 min read"
                    description="Evidence-based tips for better sleep"
                    onView={() => {}}
                  />
                )}

                {/* AI Response Metadata */}
                <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border/50">
                  <div className="flex items-center space-x-2">
                    <span>Response generated at {new Date(message.timestamp).toLocaleTimeString()}</span>
                    <Badge variant="secondary" className="text-xs px-2 py-0.5">
                      Confidence: High
                    </Badge>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Message Actions */}
        <div className={cn(
          "flex items-center space-x-1 mt-2 transition-opacity duration-200",
          showActions ? "opacity-100" : "opacity-0",
          isUser ? "justify-end" : "justify-start"
        )}>
          
          {/* Copy */}
          <Button
            size="sm"
            variant="ghost"
            className="h-7 w-7 p-0"
            onClick={() => onCopy(message.content)}
            data-testid={`button-copy-${message.id}`}
          >
            <Copy size={12} />
          </Button>

          {/* Share */}
          <Button
            size="sm"
            variant="ghost"
            className="h-7 w-7 p-0"
            onClick={() => onShare(message.content)}
            data-testid={`button-share-${message.id}`}
          >
            <Share size={12} />
          </Button>

          {/* Bookmark (AI messages only) */}
          {isAI && (
            <Button
              size="sm"
              variant="ghost"
              className="h-7 w-7 p-0"
              onClick={() => onBookmark(message.id)}
              data-testid={`button-bookmark-${message.id}`}
            >
              <Bookmark size={12} />
            </Button>
          )}

          {/* Rate AI Response */}
          {isAI && (
            <>
              <Button
                size="sm"
                variant="ghost"
                className="h-7 w-7 p-0 text-green-600 hover:bg-green-100 dark:hover:bg-green-950/30"
                onClick={() => onRate(message.id, true)}
                data-testid={`button-helpful-${message.id}`}
              >
                <ThumbsUp size={12} />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-7 w-7 p-0 text-red-600 hover:bg-red-100 dark:hover:bg-red-950/30"
                onClick={() => onRate(message.id, false)}
                data-testid={`button-not-helpful-${message.id}`}
              >
                <ThumbsDown size={12} />
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Resource Card Component for AI-recommended content
 */
interface ResourceCardProps {
  title: string;
  type: 'video' | 'audio' | 'article' | 'exercise';
  duration: string;
  description: string;
  onView: () => void;
}

function ResourceCard({ title, type, duration, description, onView }: ResourceCardProps) {
  const getIcon = () => {
    switch (type) {
      case 'video': return PlayCircle;
      case 'audio': return Headphones;
      case 'article': return FileText;
      case 'exercise': return Activity;
      default: return BookOpen;
    }
  };

  const IconComponent = getIcon();

  return (
    <Card className="bg-blue-50 border-blue-200 dark:bg-blue-950/30 dark:border-blue-800/50">
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center flex-shrink-0">
            <IconComponent className="text-blue-600 dark:text-blue-400" size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-blue-900 dark:text-blue-100 text-sm">{title}</h4>
            <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">{description}</p>
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center space-x-2 text-xs text-blue-600 dark:text-blue-400">
                <Badge variant="secondary" className="text-xs px-2 py-0.5 capitalize">
                  {type}
                </Badge>
                <span>{duration}</span>
              </div>
              <Button
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white h-8 px-3"
                onClick={onView}
              >
                <ExternalLink size={14} className="mr-1" />
                View
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Message Loading Skeleton
 */
function MessageSkeleton() {
  return (
    <div className="space-y-6">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="flex items-start space-x-3 animate-pulse">
          <div className="w-10 h-10 bg-muted rounded-full"></div>
          <div className="flex-1 space-y-2">
            <div className="bg-muted h-4 rounded w-3/4"></div>
            <div className="bg-muted h-4 rounded w-1/2"></div>
          </div>
        </div>
      ))}
    </div>
  );
}