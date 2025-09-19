import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
  User as UserIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/types";

interface ChatInterfaceProps {
  conversationId: string;
  messages: ChatMessage[];
  isLoading: boolean;
  onSendMessage: (content: string) => void;
  isSending: boolean;
  onToggleSidebar: () => void;
}

/**
 * Chat Interface Component - Real-time chat with AI assistant
 * Features message bubbles, typing indicators, and quick actions
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
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Quick response suggestions
  const quickSuggestions = [
    "I'm feeling anxious",
    "Help me sleep better", 
    "I'm stressed about exams",
    "I feel lonely",
    "I need coping strategies"
  ];

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

  const handleSendMessage = () => {
    const content = inputValue.trim();
    if (!content) return;

    onSendMessage(content);
    setInputValue("");
  };

  const handleQuickSuggestion = (suggestion: string) => {
    onSendMessage(suggestion);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="bg-card border-b border-border p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Button
            size="icon"
            variant="ghost"
            className="lg:hidden"
            onClick={onToggleSidebar}
            data-testid="button-toggle-sidebar"
          >
            <Menu size={20} />
          </Button>
          
          <div className="w-12 h-12 gradient-primary rounded-full flex items-center justify-center">
            <Bot className="text-white" size={24} />
          </div>
          
          <div>
            <h3 className="font-semibold text-foreground">MindCare AI Assistant</h3>
            <div className="flex items-center space-x-2 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-muted-foreground">Online and ready to help</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button size="sm" variant="outline" data-testid="button-share-conversation">
            Share
          </Button>
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4 custom-scrollbar">
        <div className="space-y-4 max-w-4xl mx-auto">
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-muted rounded-full"></div>
                    <div className="bg-muted h-16 rounded-lg flex-1 max-w-md"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : messages.length === 0 ? (
            <WelcomeMessage onQuickSuggestion={handleQuickSuggestion} />
          ) : (
            messages.map((message) => (
              <MessageBubble 
                key={message.id} 
                message={message} 
                onCopy={copyMessage}
              />
            ))
          )}

          {/* Typing Indicator */}
          {(isTyping || isSending) && (
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 gradient-primary rounded-full flex items-center justify-center">
                <Bot className="text-white" size={16} />
              </div>
              <Card className="bg-muted max-w-md">
                <CardContent className="p-3">
                  <div className="loading-dots">
                    <div></div>
                    <div></div>
                    <div></div>
                  </div>
                  <span className="text-sm text-muted-foreground ml-2">AI is typing...</span>
                </CardContent>
              </Card>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Quick Suggestions */}
      {messages.length === 0 && (
        <div className="p-4 border-t border-border bg-muted/30">
          <div className="max-w-4xl mx-auto">
            <p className="text-sm text-muted-foreground mb-3">Quick suggestions:</p>
            <div className="flex flex-wrap gap-2">
              {quickSuggestions.map((suggestion, index) => (
                <Button
                  key={index}
                  size="sm"
                  variant="outline"
                  className="text-sm"
                  onClick={() => handleQuickSuggestion(suggestion)}
                  data-testid={`button-suggestion-${index}`}
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="border-t border-border p-4 bg-card">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-end space-x-2">
            <div className="flex-1 relative">
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Share what's on your mind... I'm here to help"
                className="pr-12 min-h-[50px] resize-none"
                disabled={isSending}
                data-testid="input-chat-message"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                <Button size="icon" variant="ghost" className="h-8 w-8" data-testid="button-emoji">
                  <Smile size={16} />
                </Button>
                <Button size="icon" variant="ghost" className="h-8 w-8" data-testid="button-voice">
                  <Mic size={16} />
                </Button>
              </div>
            </div>
            
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isSending}
              size="icon"
              className="h-12 w-12 gradient-primary text-white"
              data-testid="button-send-message"
            >
              <Send size={20} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Welcome Message Component - Shown at start of conversation
 */
function WelcomeMessage({ onQuickSuggestion }: { onQuickSuggestion: (suggestion: string) => void }) {
  return (
    <div className="text-center space-y-6 py-8">
      <div className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center mx-auto">
        <Bot className="text-white" size={32} />
      </div>
      
      <div className="space-y-3">
        <h3 className="text-xl font-semibold text-foreground font-heading">
          Hello! I'm your MindCare AI Assistant
        </h3>
        <p className="text-muted-foreground max-w-lg mx-auto">
          I'm here to provide compassionate support and evidence-based coping strategies. 
          Feel free to share what's on your mind - this conversation is completely confidential.
        </p>
      </div>

      <Alert className="max-w-lg mx-auto">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          If you're experiencing a mental health emergency, please reach out to a crisis hotline or emergency services immediately.
        </AlertDescription>
      </Alert>

      <div className="space-y-3">
        <p className="text-sm font-medium text-foreground">How can I support you today?</p>
        <div className="flex flex-wrap gap-2 justify-center">
          {[
            "I'm feeling overwhelmed",
            "Help with anxiety",
            "Sleep troubles",
            "Academic stress"
          ].map((suggestion, index) => (
            <Button
              key={index}
              size="sm"
              variant="outline"
              onClick={() => onQuickSuggestion(suggestion)}
              data-testid={`button-welcome-suggestion-${index}`}
            >
              {suggestion}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Message Bubble Component - Individual chat message display
 */
function MessageBubble({ message, onCopy }: { message: ChatMessage; onCopy: (content: string) => void }) {
  const isUser = message.role === "user";
  const [showActions, setShowActions] = useState(false);

  return (
    <div 
      className={cn("flex items-start space-x-3", isUser && "flex-row-reverse space-x-reverse")}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Avatar */}
      <div className={cn(
        "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
        isUser ? "bg-primary" : "gradient-primary"
      )}>
        {isUser ? (
          <UserIcon className="text-white" size={16} />
        ) : (
          <Bot className="text-white" size={16} />
        )}
      </div>

      {/* Message Content */}
      <div className={cn("max-w-md lg:max-w-lg", isUser && "ml-auto")}>
        <Card className={cn(
          "transition-all duration-200",
          isUser 
            ? "bg-primary text-primary-foreground ml-auto" 
            : "bg-muted"
        )}>
          <CardContent className="p-4">
            <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
            
            {/* Message Actions */}
            {showActions && (
              <div className={cn(
                "flex items-center space-x-2 mt-3 pt-3 border-t",
                isUser ? "border-primary-foreground/20" : "border-border"
              )}>
                <Button
                  size="icon"
                  variant="ghost"
                  className={cn(
                    "h-6 w-6",
                    isUser ? "hover:bg-primary-foreground/20" : "hover:bg-background"
                  )}
                  onClick={() => onCopy(message.content)}
                  data-testid={`button-copy-message-${message.id}`}
                >
                  <Copy size={12} />
                </Button>
                
                {!isUser && (
                  <>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-6 w-6 hover:bg-background"
                      data-testid={`button-suggest-resource-${message.id}`}
                    >
                      <BookOpen size={12} />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-6 w-6 hover:bg-background"
                      data-testid={`button-book-appointment-${message.id}`}
                    >
                      <Calendar size={12} />
                    </Button>
                  </>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Timestamp */}
        <p className={cn(
          "text-xs text-muted-foreground mt-1 px-1",
          isUser && "text-right"
        )}>
          {new Date(message.timestamp).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </p>

        {/* AI Suggestions */}
        {!isUser && message.content.includes("suggest") && (
          <div className="mt-3 space-y-2">
            <p className="text-xs font-medium text-foreground">Suggested actions:</p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                <Calendar size={10} className="mr-1" />
                Book Appointment
              </Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                <BookOpen size={10} className="mr-1" />
                View Resources
              </Badge>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
