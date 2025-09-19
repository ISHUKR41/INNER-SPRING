import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Heart, 
  MessageCircle, 
  Flag, 
  Clock, 
  ChevronUp,
  Send,
  User,
  Eye,
  MoreVertical
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import type { ForumPost as ForumPostType, ForumReply } from "@/types";

interface ForumPostProps {
  post: ForumPostType;
  onUpvote: (postId: string) => void;
  className?: string;
  "data-testid"?: string;
}

/**
 * Forum Post Component - Individual post display with replies
 * Features upvoting, replying, reporting, and moderation status
 */
export default function ForumPost({ 
  post, 
  onUpvote, 
  className,
  "data-testid": testId
}: ForumPostProps) {
  const [isRepliesOpen, setIsRepliesOpen] = useState(false);
  const [isReplyDialogOpen, setIsReplyDialogOpen] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [hasUpvoted, setHasUpvoted] = useState(false);

  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Mock user ID - in production would come from auth context
  const userId = "mock-user-id";

  // Fetch replies for this post
  const { data: replies, isLoading: repliesLoading } = useQuery({
    queryKey: [`/api/forum/posts/${post.id}/replies`],
    enabled: isRepliesOpen,
  });

  // Create reply mutation
  const createReplyMutation = useMutation({
    mutationFn: async (content: string) => {
      const response = await apiRequest("POST", "/api/forum/replies", {
        postId: post.id,
        userId,
        content,
        isAnonymous: true
      });
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/forum/posts/${post.id}/replies`] });
      setReplyContent("");
      setIsReplyDialogOpen(false);
      toast({
        title: "Reply Posted",
        description: "Your reply has been submitted and is awaiting moderation.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to post reply. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleUpvote = () => {
    if (!hasUpvoted) {
      onUpvote(post.id);
      setHasUpvoted(true);
    }
  };

  const handleReply = () => {
    if (replyContent.trim().length < 10) {
      toast({
        title: "Reply too short",
        description: "Please write at least 10 characters.",
        variant: "destructive",
      });
      return;
    }
    createReplyMutation.mutate(replyContent);
  };

  const handleReport = () => {
    toast({
      title: "Post Reported",
      description: "Thank you for helping keep our community safe. Moderators will review this post.",
    });
  };

  // Get time ago string
  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - new Date(date).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return new Date(date).toLocaleDateString();
  };

  return (
    <Card className={cn("hover:shadow-md transition-shadow", className)} data-testid={testId}>
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Post Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <User className="text-white" size={16} />
              </div>
              <div>
                <p className="font-medium text-foreground">
                  {post.isAnonymous ? "Anonymous Student" : "Student"}
                </p>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Clock size={12} />
                  <span>{getTimeAgo(post.createdAt)}</span>
                  {post.category && (
                    <>
                      <span>•</span>
                      <Badge 
                        variant="secondary" 
                        className="text-xs"
                        style={{ backgroundColor: post.category.color + "20", color: post.category.color }}
                      >
                        {post.category.name}
                      </Badge>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Moderation Status */}
            <div className="flex items-center space-x-2">
              {post.isApproved ? (
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  Approved
                </Badge>
              ) : (
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                  Pending Review
                </Badge>
              )}
              <Button size="icon" variant="ghost" onClick={handleReport} data-testid={`button-report-${post.id}`}>
                <MoreVertical size={16} />
              </Button>
            </div>
          </div>

          {/* Post Content */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-foreground">{post.title}</h3>
            <p className="text-foreground whitespace-pre-wrap leading-relaxed">{post.content}</p>
          </div>

          {/* Post Actions */}
          <div className="flex items-center justify-between pt-2 border-t border-border">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "flex items-center space-x-2",
                  hasUpvoted && "text-primary bg-primary/10"
                )}
                onClick={handleUpvote}
                disabled={hasUpvoted}
                data-testid={`button-upvote-${post.id}`}
              >
                <ChevronUp size={16} />
                <span>{post.upvotes + (hasUpvoted ? 1 : 0)}</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="flex items-center space-x-2"
                onClick={() => setIsRepliesOpen(!isRepliesOpen)}
                data-testid={`button-replies-${post.id}`}
              >
                <MessageCircle size={16} />
                <span>{post.replyCount} replies</span>
              </Button>

              <Dialog open={isReplyDialogOpen} onOpenChange={setIsReplyDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm" data-testid={`button-reply-${post.id}`}>
                    Reply
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="font-heading">Reply to Post</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <p className="text-sm font-medium text-foreground">{post.title}</p>
                      <p className="text-sm text-muted-foreground line-clamp-3">{post.content}</p>
                    </div>
                    
                    <Textarea
                      placeholder="Write your supportive response..."
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      className="min-h-[100px]"
                      data-testid="textarea-reply-content"
                    />
                    
                    <div className="flex space-x-2">
                      <Button 
                        onClick={handleReply}
                        disabled={createReplyMutation.isPending || replyContent.trim().length < 10}
                        className="gradient-primary text-white"
                        data-testid="button-submit-reply"
                      >
                        <Send size={16} className="mr-2" />
                        {createReplyMutation.isPending ? "Posting..." : "Post Reply"}
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => setIsReplyDialogOpen(false)}
                        data-testid="button-cancel-reply"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-destructive"
              onClick={handleReport}
              data-testid={`button-report-post-${post.id}`}
            >
              <Flag size={14} className="mr-1" />
              Report
            </Button>
          </div>

          {/* Replies Section */}
          {isRepliesOpen && (
            <div className="mt-6 pt-6 border-t border-border">
              <h4 className="font-medium text-foreground mb-4">Replies ({post.replyCount})</h4>
              
              {repliesLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="bg-muted h-20 rounded-lg"></div>
                    </div>
                  ))}
                </div>
              ) : replies && replies.length > 0 ? (
                <div className="space-y-4">
                  {replies.map((reply: ForumReply) => (
                    <div key={reply.id} className="bg-muted/30 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-secondary to-accent flex items-center justify-center">
                            <User className="text-white" size={12} />
                          </div>
                          <span className="text-sm font-medium text-foreground">
                            {reply.isAnonymous ? "Anonymous Student" : "Student"}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {getTimeAgo(reply.createdAt)}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Button size="icon" variant="ghost" className="h-6 w-6">
                            <ChevronUp size={12} />
                          </Button>
                          <span className="text-xs text-muted-foreground">{reply.upvotes}</span>
                        </div>
                      </div>
                      <p className="text-sm text-foreground whitespace-pre-wrap">{reply.content}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground italic">No replies yet. Be the first to respond!</p>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
