import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Send, 
  Bot,
  User as UserIcon,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/types";

interface ChatInterfaceProps {
  conversationId: string;
  messages: ChatMessage[];
  isLoading: boolean;
  onSendMessage: (content: string, context?: any) => void;
  isSending: boolean;
  onToggleSidebar: () => void;
}

/**
 * Simple Chat Interface Component for Mental Health Support
 * Clean, minimal design inspired by ChatGPT, WhatsApp, and iMessage
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
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-focus input
  useEffect(() => {
    if (inputRef.current && !window.matchMedia('(max-width: 768px)').matches) {
      inputRef.current.focus();
    }
  }, [conversationId]);

  const handleSendMessage = useCallback(() => {
    const content = inputValue.trim();
    if (!content) return;

    onSendMessage(content);
    setInputValue("");
  }, [inputValue, onSendMessage]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp: string | Date) => {
    const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900">
      
      {/* Messages Area */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full px-4 py-6">
          <div className="max-w-4xl mx-auto space-y-4">
            
            {/* Welcome Message */}
            {messages.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <Bot className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Welcome to MindCare AI
                </h2>
                <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                  I'm here to support you with your mental health. 
                  Feel free to share what's on your mind.
                </p>
              </div>
            )}

            {/* Chat Messages */}
            {messages.map((message, index) => {
              const isUser = message.role === "user";
              const showAvatar = !isUser && (index === 0 || messages[index - 1]?.role === "user");
              
              return (
                <div
                  key={message.id}
                  className={cn(
                    "flex gap-3 max-w-[80%]",
                    isUser ? "ml-auto flex-row-reverse" : "mr-auto"
                  )}
                  data-testid={`message-${message.id}`}
                >
                  
                  {/* Avatar (only for AI messages, and only when needed) */}
                  {!isUser && (
                    <div className="flex-shrink-0">
                      {showAvatar ? (
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-blue-600 text-white">
                            <Bot className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                      ) : (
                        <div className="w-8" />
                      )}
                    </div>
                  )}

                  {/* Message Bubble */}
                  <div
                    className={cn(
                      "rounded-2xl px-4 py-3 max-w-full",
                      isUser
                        ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-br-md"
                        : "bg-blue-50 dark:bg-blue-900/30 text-gray-900 dark:text-white rounded-bl-md"
                    )}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {message.content}
                    </p>
                    
                    {/* Timestamp */}
                    <div className={cn(
                      "text-xs text-gray-500 dark:text-gray-400 mt-1",
                      isUser ? "text-right" : "text-left"
                    )}>
                      {formatTime(message.timestamp)}
                    </div>
                  </div>

                  {/* User Avatar (minimal) */}
                  {isUser && (
                    <div className="flex-shrink-0">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-gray-600 text-white">
                          <UserIcon className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Typing Indicator */}
            {isSending && (
              <div className="flex gap-3 max-w-[80%] mr-auto">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-blue-600 text-white">
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-blue-50 dark:bg-blue-900/30 rounded-2xl rounded-bl-md px-4 py-3">
                  <div className="flex items-center space-x-1">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                      AI is typing...
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        <div className="max-w-4xl mx-auto p-4">
          <div className="flex items-end space-x-3">
            
            {/* Text Input */}
            <div className="flex-1 relative">
              <Textarea
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="How are you feeling today?"
                className={cn(
                  "min-h-[44px] max-h-32 resize-none rounded-2xl border-gray-300 dark:border-gray-600",
                  "bg-gray-50 dark:bg-gray-800 focus:bg-white dark:focus:bg-gray-700",
                  "placeholder:text-gray-500 dark:placeholder:text-gray-400",
                  "pr-12"
                )}
                disabled={isSending}
                rows={1}
                data-testid="input-message"
              />
              
              {/* Send Button (appears when typing) */}
              {inputValue.trim() && (
                <Button
                  onClick={handleSendMessage}
                  disabled={isSending || !inputValue.trim()}
                  className="absolute right-2 bottom-2 h-8 w-8 rounded-full bg-blue-600 hover:bg-blue-700 p-0"
                  data-testid="button-send-message"
                  aria-label="Send message"
                >
                  {isSending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}