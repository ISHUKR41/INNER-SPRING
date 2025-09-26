import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import {
  Send,
  Bot,
  User,
  Loader2,
  MessageCircle,
  Brain,
  BookOpen,
  Plus,
  History,
  Trash2,
  Download,
  Sparkles,
  Menu,
  X,
  Mic,
  Paperclip,
  Heart,
  Shield,
  Clock,
  ArrowUp,
  Copy,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
  Zap,
  Star,
  Settings,
  MoreVertical,
  Activity,
  Archive,
  Search,
  Filter,
  Volume2,
  VolumeX,
  Moon,
  Sun,
  Maximize2,
  Minimize2,
  Home,
  HelpCircle,
  FileText,
  Calendar,
  Users,
  CheckCircle2,
  AlertCircle,
  Info,
  Lightbulb,
} from "lucide-react";
import { geminiService } from "../../services/geminiService";
import {
  chatStorageService,
  ChatMessage,
  ChatConversation,
} from "../../services/chatStorageService";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../hooks/use-toast";
import { cn } from "../../lib/utils";
import ProfessionalNavbar from "../../components/layout/ProfessionalNavbar";

// Professional color scheme and styling constants
const PROFESSIONAL_COLORS = {
  primary: "from-indigo-600 to-purple-600",
  secondary: "from-blue-600 to-cyan-600",
  success: "from-green-600 to-emerald-600",
  warning: "from-yellow-600 to-orange-600",
  error: "from-red-600 to-pink-600",
  neutral: "from-gray-600 to-slate-600",
};

interface TypingIndicatorProps {
  isVisible: boolean;
}

const TypingIndicator: React.FC<TypingIndicatorProps> = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <motion.div
      className="flex items-center space-x-2 px-4 py-3 bg-blue-50 rounded-2xl max-w-fit mb-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
    >
      <Avatar className="h-8 w-8">
        <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white text-xs">
          <Brain className="h-4 w-4" />
        </AvatarFallback>
      </Avatar>
      <div className="flex space-x-1">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 bg-indigo-500 rounded-full"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </div>
      <span className="text-sm text-gray-600 font-medium">
        AI is thinking...
      </span>
    </motion.div>
  );
};

interface MessageProps {
  message: ChatMessage;
  onCopy: (content: string) => void;
  onRegenerate?: () => void;
  onFeedback?: (messageId: string, feedback: "positive" | "negative") => void;
}

const MessageBubble: React.FC<MessageProps> = ({
  message,
  onCopy,
  onRegenerate,
  onFeedback,
}) => {
  const isBot = message.sender === "ai";
  const [showActions, setShowActions] = useState(false);

  return (
    <motion.div
      className={cn(
        "flex gap-3 group",
        isBot ? "justify-start" : "justify-end"
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {isBot && (
        <Avatar className="h-10 w-10 shadow-md">
          <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white">
            <Brain className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>
      )}

      <div
        className={cn(
          "flex flex-col space-y-2 max-w-[75%]",
          isBot ? "items-start" : "items-end"
        )}
      >
        <motion.div
          className={cn(
            "relative px-4 py-3 rounded-2xl shadow-sm",
            isBot
              ? "bg-white border border-gray-200 text-gray-900"
              : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
          )}
          whileHover={{ y: -1 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="text-sm leading-relaxed whitespace-pre-wrap">
            {message.text}
          </div>

          {/* Message timestamp */}
          <div
            className={cn(
              "text-xs mt-2 opacity-70",
              isBot ? "text-gray-500" : "text-white"
            )}
          >
            {message.timestamp.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>

          {/* Message actions */}
          <AnimatePresence>
            {showActions && (
              <motion.div
                className={cn(
                  "absolute top-0 flex items-center space-x-1 shadow-lg rounded-lg border bg-white p-1",
                  isBot ? "-right-20" : "-left-20"
                )}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
              >
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 hover:bg-gray-100"
                      onClick={() => onCopy(message.text)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Copy message</TooltipContent>
                </Tooltip>

                {isBot && onRegenerate && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 hover:bg-gray-100"
                        onClick={onRegenerate}
                      >
                        <RefreshCw className="h-3 w-3" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Regenerate response</TooltipContent>
                  </Tooltip>
                )}

                {isBot && onFeedback && (
                  <>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 hover:bg-green-100 text-green-600"
                          onClick={() => onFeedback(message.id, "positive")}
                        >
                          <ThumbsUp className="h-3 w-3" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Good response</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 hover:bg-red-100 text-red-600"
                          onClick={() => onFeedback(message.id, "negative")}
                        >
                          <ThumbsDown className="h-3 w-3" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Poor response</TooltipContent>
                    </Tooltip>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {!isBot && (
        <Avatar className="h-10 w-10 shadow-md">
          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
            <User className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>
      )}
    </motion.div>
  );
};

const ModernProfessionalChat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<
    string | null
  >(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [quickReplies] = useState([
    "I'm feeling anxious today",
    "Can you help me with stress management?",
    "I need motivation",
    "Help me understand my emotions",
    "What are healthy coping strategies?",
    "I'm having trouble sleeping",
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { currentUser } = useAuth();
  const { toast } = useToast();

  // Load conversations and messages on mount
  useEffect(() => {
    if (currentUser) {
      loadConversations();
      loadWelcomeMessage();
    }
  }, [currentUser]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadWelcomeMessage = () => {
    const welcomeMessage: ChatMessage = {
      id: "welcome",
      sender: "ai",
      text: `Hello! I'm your mental health support assistant. I'm here to provide guidance, coping strategies, and emotional support whenever you need it.

How are you feeling today? You can:
• Share what's on your mind
• Ask for coping strategies
• Discuss your emotions
• Get stress management tips
• Practice mindfulness exercises

Remember, while I'm here to help, I'm not a replacement for professional therapy. If you're experiencing a mental health crisis, please contact emergency services or a crisis hotline immediately.

What would you like to talk about?`,
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
  };

  const loadConversations = () => {
    if (currentUser) {
      const userConversations = chatStorageService.getAllConversations();
      setConversations(userConversations);

      if (userConversations.length > 0 && !currentConversationId) {
        const latestConversation = userConversations[0];
        setCurrentConversationId(latestConversation.id);
        setMessages(latestConversation.messages);
      }
    }
  };

  const createNewConversation = () => {
    if (!currentUser) return;

    const newConversation = chatStorageService.createConversation();

    setCurrentConversationId(newConversation.id);
    setMessages([]);
    loadWelcomeMessage();
    loadConversations();
    setSidebarOpen(false);
  };

  const selectConversation = (conversationId: string) => {
    const conversation = conversations.find((c) => c.id === conversationId);
    if (conversation) {
      setCurrentConversationId(conversationId);
      setMessages(conversation.messages);
      setSidebarOpen(false);
    }
  };

  const deleteConversation = (conversationId: string) => {
    if (!currentUser) return;

    chatStorageService.deleteConversation(conversationId);

    if (conversationId === currentConversationId) {
      setCurrentConversationId(null);
      setMessages([]);
      loadWelcomeMessage();
    }

    loadConversations();
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading || !currentUser) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      text: inputMessage.trim(),
      timestamp: new Date(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputMessage("");
    setIsLoading(true);
    setIsTyping(true);

    try {
      // Create conversation if it doesn't exist
      let conversationId = currentConversationId;
      if (!conversationId) {
        const newConversation = chatStorageService.createConversation();
        conversationId = newConversation.id;
        setCurrentConversationId(conversationId);
      }

      // Save user message
      chatStorageService.addMessageToConversation(conversationId, userMessage);

      // Simulate typing delay
      await new Promise((resolve) =>
        setTimeout(resolve, 1000 + Math.random() * 2000)
      );

      // Get AI response
      const aiResponse = await geminiService.generateResponse(
        inputMessage.trim()
      );

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: aiResponse,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Save assistant message
      chatStorageService.addMessageToConversation(
        conversationId,
        assistantMessage
      );

      // Update conversations list
      loadConversations();
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleCopyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({
      title: "Copied",
      description: "Message copied to clipboard",
      variant: "default",
    });
  };

  const handleQuickReply = (reply: string) => {
    setInputMessage(reply);
    textareaRef.current?.focus();
  };

  const handleRegenerate = async () => {
    if (messages.length < 2) return;

    const lastUserMessage = [...messages]
      .reverse()
      .find((m) => m.sender === "user");
    if (!lastUserMessage) return;

    // Remove last AI response
    const filteredMessages = messages.slice(0, -1);
    setMessages(filteredMessages);

    setIsLoading(true);
    setIsTyping(true);

    try {
      const aiResponse = await geminiService.generateResponse(
        lastUserMessage.text
      );

      const assistantMessage: ChatMessage = {
        id: Date.now().toString(),
        sender: "ai",
        text: aiResponse,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      if (currentUser && currentConversationId) {
        chatStorageService.addMessageToConversation(
          currentConversationId,
          assistantMessage
        );
      }
    } catch (error) {
      console.error("Error regenerating message:", error);
      toast({
        title: "Error",
        description: "Failed to regenerate message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  const handleFeedback = (
    messageId: string,
    feedback: "positive" | "negative"
  ) => {
    toast({
      title: "Feedback Received",
      description: `Thank you for your ${feedback} feedback. This helps improve our AI responses.`,
      variant: "default",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <ProfessionalNavbar />

      <div
        className={cn(
          "flex h-screen pt-16 transition-all duration-300",
          isFullscreen ? "fixed inset-0 pt-0 z-50 bg-white" : ""
        )}
      >
        {/* Sidebar */}
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetContent side="left" className="w-80 p-0">
            <div className="flex flex-col h-full">
              <div className="p-6 border-b bg-gradient-to-r from-indigo-600 to-purple-600">
                <div className="flex items-center space-x-3 text-white">
                  <Brain className="h-8 w-8" />
                  <div>
                    <h2 className="text-lg font-semibold">
                      Mental Health Assistant
                    </h2>
                    <p className="text-sm text-white/80">Your conversations</p>
                  </div>
                </div>
              </div>

              <div className="p-4">
                <Button
                  onClick={createNewConversation}
                  className="w-full h-12 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  New Conversation
                </Button>
              </div>

              <ScrollArea className="flex-1 px-4">
                <div className="space-y-2">
                  {conversations.map((conversation) => (
                    <motion.div
                      key={conversation.id}
                      className={cn(
                        "p-3 rounded-xl cursor-pointer group hover:bg-gray-100 transition-colors",
                        currentConversationId === conversation.id &&
                          "bg-indigo-50 border border-indigo-200"
                      )}
                      onClick={() => selectConversation(conversation.id)}
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium text-gray-900 truncate">
                            {conversation.title}
                          </h3>
                          <p className="text-xs text-gray-500 mt-1">
                            {conversation.messages.length} messages
                          </p>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() =>
                                deleteConversation(conversation.id)
                              }
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </SheetContent>
        </Sheet>

        {/* Main Chat Interface */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="bg-white/95 backdrop-blur-sm border-b border-gray-200 px-6 py-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden"
                >
                  <Menu className="h-5 w-5" />
                </Button>

                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-md">
                    <Brain className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h1 className="text-lg font-semibold text-gray-900">
                      AI Mental Health Assistant
                    </h1>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span>Online and ready to help</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsFullscreen(!isFullscreen)}
                    >
                      {isFullscreen ? (
                        <Minimize2 className="h-4 w-4" />
                      ) : (
                        <Maximize2 className="h-4 w-4" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                  </TooltipContent>
                </Tooltip>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Download className="h-4 w-4 mr-2" />
                      Export Chat
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Clear History
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <HelpCircle className="h-4 w-4 mr-2" />
                      Help & Support
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <ScrollArea className="flex-1 p-6">
            <div className="max-w-4xl mx-auto space-y-6">
              {messages.length === 0 && (
                <motion.div
                  className="text-center py-12"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="h-16 w-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                    <Brain className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Welcome to Your Mental Health Assistant
                  </h3>
                  <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    I'm here to provide support, guidance, and coping
                    strategies. Start a conversation about how you're feeling
                    today.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto">
                    {quickReplies.slice(0, 4).map((reply, index) => (
                      <motion.button
                        key={index}
                        className="p-4 text-left bg-white rounded-xl border border-gray-200 hover:border-indigo-200 hover:bg-indigo-50 transition-all duration-200 shadow-sm hover:shadow-md"
                        onClick={() => handleQuickReply(reply)}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="h-8 w-8 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center">
                            <MessageCircle className="h-4 w-4 text-indigo-600" />
                          </div>
                          <span className="text-sm font-medium text-gray-900">
                            {reply}
                          </span>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              {messages.map((message) => (
                <MessageBubble
                  key={message.id}
                  message={message}
                  onCopy={handleCopyMessage}
                  onRegenerate={
                    message.sender === "ai" ? handleRegenerate : undefined
                  }
                  onFeedback={handleFeedback}
                />
              ))}

              <TypingIndicator isVisible={isTyping} />
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="bg-white/95 backdrop-blur-sm border-t border-gray-200 p-6">
            <div className="max-w-4xl mx-auto">
              {/* Quick Replies */}
              {messages.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {quickReplies.slice(0, 3).map((reply, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickReply(reply)}
                      className="text-xs rounded-full border-gray-200 hover:border-indigo-200 hover:bg-indigo-50"
                    >
                      {reply}
                    </Button>
                  ))}
                </div>
              )}

              <div className="flex items-end space-x-4">
                <div className="flex-1 relative">
                  <textarea
                    ref={textareaRef}
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Share what's on your mind, ask for support, or describe how you're feeling..."
                    className="w-full min-h-[60px] max-h-[120px] p-4 pr-12 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none transition-all duration-200"
                    disabled={isLoading}
                  />

                  <div className="absolute right-3 bottom-3 flex items-center space-x-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600"
                        >
                          <Paperclip className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Attach file</TooltipContent>
                    </Tooltip>
                  </div>
                </div>

                <Button
                  onClick={sendMessage}
                  disabled={!inputMessage.trim() || isLoading}
                  className="h-[60px] px-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      <Send className="h-5 w-5 mr-2" />
                      Send
                    </>
                  )}
                </Button>
              </div>

              {/* Disclaimer */}
              <div className="mt-4 text-center">
                <Alert className="max-w-2xl mx-auto border-blue-200 bg-blue-50">
                  <Info className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-800 text-sm">
                    This AI assistant provides general mental health support and
                    is not a replacement for professional therapy. If you're
                    experiencing a crisis, please contact emergency services or
                    a crisis hotline immediately.
                  </AlertDescription>
                </Alert>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernProfessionalChat;
