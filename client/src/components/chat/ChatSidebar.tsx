import { useState } from "react";
import { 
  Sheet, SheetContent, SheetHeader, SheetTitle
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  MessageCircle, 
  Plus, 
  Trash2,
  Clock
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import type { ChatConversation } from "@/types";

export interface ChatSidebarProps {
  userId: string;
  selectedConversationId: string | null;
  conversations: ChatConversation[];
  conversationsLoading: boolean;
  connectionState: 'connecting' | 'connected' | 'disconnected' | 'error';
  onConversationSelect: (conversationId: string) => void;
  onNewConversation: () => void;
  onDeleteConversation: (conversationId: string) => void;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

/**
 * Simple Chat Sidebar Component
 * Clean, minimal design with just basic chat history
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
  const isMobile = useIsMobile();

  const formatDate = (dateString: string | Date) => {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return "Today";
    } else if (diffDays === 2) {
      return "Yesterday";
    } else if (diffDays <= 7) {
      return `${diffDays - 1} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const getConversationTitle = (conversation: ChatConversation) => {
    if (conversation.title && conversation.title !== "New Chat") {
      return conversation.title;
    }
    return `Chat ${formatDate(conversation.updatedAt)}`;
  };

  const handleDeleteConversation = (conversationId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this conversation? This action cannot be undone.")) {
      onDeleteConversation(conversationId);
    }
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-800">
      
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          Chat History
        </h2>
        
        {/* New Chat Button */}
        <Button
          onClick={onNewConversation}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          data-testid="button-new-chat"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Chat
        </Button>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-2">
            
            {/* Loading State */}
            {conversationsLoading && (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  Loading conversations...
                </p>
              </div>
            )}

            {/* Empty State */}
            {!conversationsLoading && conversations.length === 0 && (
              <div className="text-center py-12">
                <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No conversations yet
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  Start a new chat to begin
                </p>
              </div>
            )}

            {/* Conversations */}
            {!conversationsLoading && conversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => onConversationSelect(conversation.id)}
                className={cn(
                  "group p-3 rounded-lg cursor-pointer transition-all duration-200 mb-2",
                  "hover:bg-white dark:hover:bg-gray-700",
                  selectedConversationId === conversation.id
                    ? "bg-white dark:bg-gray-700 shadow-sm border border-blue-200 dark:border-blue-700"
                    : "bg-transparent"
                )}
                data-testid={`conversation-${conversation.id}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <MessageCircle className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {getConversationTitle(conversation)}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Clock className="h-3 w-3 text-gray-400" />
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formatDate(conversation.updatedAt)}
                      </p>
                    </div>
                  </div>

                  {/* Delete Button */}
                  <Button
                    onClick={(e) => handleDeleteConversation(conversation.id, e)}
                    variant="ghost"
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400"
                    data-testid={`button-delete-${conversation.id}`}
                    aria-label="Delete conversation"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Connection Status */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <div className={cn(
            "w-2 h-2 rounded-full",
            connectionState === 'connected' ? "bg-green-500" : 
            connectionState === 'connecting' ? "bg-yellow-500" : "bg-red-500"
          )} />
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {connectionState === 'connected' ? 'Connected' :
             connectionState === 'connecting' ? 'Connecting...' : 'Disconnected'}
          </span>
        </div>
      </div>
    </div>
  );

  // Always use overlay (Sheet) for both mobile and desktop to achieve 90% chat focus
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-80 p-0">
        <SidebarContent />
      </SheetContent>
    </Sheet>
  );
}