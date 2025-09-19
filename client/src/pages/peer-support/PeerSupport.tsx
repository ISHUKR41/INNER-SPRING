import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Header from "@/components/layout/Header";
import ForumPost from "./components/ForumPost";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  Plus, 
  Search, 
  MessageSquare, 
  TrendingUp,
  Heart,
  Shield,
  Filter,
  AlertTriangle,
  CheckCircle,
  Clock
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { ForumPost as ForumPostType, ForumCategory, ForumFilters } from "@/types";

// Form validation schema
const postSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(150, "Title must be less than 150 characters"),
  content: z.string().min(10, "Content must be at least 10 characters").max(5000, "Content must be less than 5000 characters"),
  categoryId: z.string().min(1, "Please select a category"),
  isAnonymous: z.boolean().default(true)
});

type PostFormData = z.infer<typeof postSchema>;

/**
 * Peer Support Page - Moderated forum for student discussions
 * Features anonymous posting, categories, moderation, and community guidelines
 */
export default function PeerSupport() {
  const [filters, setFilters] = useState<ForumFilters>({
    categoryId: "",
    sortBy: "recent"
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Mock user ID - in production would come from auth context
  const userId = "mock-user-id";

  // Fetch forum categories with proper typing and default empty array
  const { data: categories = [], isLoading: categoriesLoading } = useQuery<ForumCategory[]>({
    queryKey: ["/api/forum/categories"],
  });

  // Fetch forum posts with proper typing and default empty array
  const { data: posts = [], isLoading: postsLoading } = useQuery<ForumPostType[]>({
    queryKey: ["/api/forum/posts", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.categoryId) params.append("categoryId", filters.categoryId);
      params.append("limit", "20");
      
      const response = await fetch(`/api/forum/posts?${params.toString()}`);
      return await response.json();
    },
  });

  // Create post form
  const form = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      content: "",
      categoryId: "",
      isAnonymous: true,
    },
  });

  // Create post mutation
  const createPostMutation = useMutation({
    mutationFn: async (data: PostFormData) => {
      const response = await apiRequest("POST", "/api/forum/posts", {
        userId,
        ...data
      });
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/forum/posts"] });
      form.reset();
      setIsCreateDialogOpen(false);
      toast({
        title: "Post Created",
        description: "Your post has been submitted and is awaiting moderation.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Upvote post mutation
  const upvotePostMutation = useMutation({
    mutationFn: async (postId: string) => {
      const response = await apiRequest("POST", `/api/forum/posts/${postId}/upvote`, {});
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/forum/posts"] });
    },
  });

  const onSubmit = (data: PostFormData) => {
    createPostMutation.mutate(data);
  };

  const handleUpvote = (postId: string) => {
    upvotePostMutation.mutate(postId);
  };

  // Filter posts based on search term
  const filteredPosts = posts?.filter((post: ForumPostType) => {
    if (!searchTerm) return true;
    return post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
           post.content.toLowerCase().includes(searchTerm.toLowerCase());
  }) || [];

  // Sort options
  const sortOptions = [
    { value: "recent", label: "Most Recent" },
    { value: "popular", label: "Most Popular" },
    { value: "replies", label: "Most Replies" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4 font-heading">Peer Support Community</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Connect safely with fellow students in moderated forums. Share experiences and support each other anonymously.
            </p>
            
            {/* Community Guidelines Alert */}
            <Alert className="max-w-4xl mx-auto mt-6">
              <Shield className="h-4 w-4" />
              <AlertDescription>
                <span className="font-medium">Community Guidelines:</span> Be respectful, supportive, and kind. 
                All posts are moderated for safety. Report inappropriate content using the report button.
              </AlertDescription>
            </Alert>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Create Post Button */}
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full gradient-primary text-white" data-testid="button-create-post">
                    <Plus className="mr-2" size={18} />
                    Share Your Experience
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="font-heading">Create a New Post</DialogTitle>
                  </DialogHeader>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Title *</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                placeholder="What would you like to share?"
                                data-testid="input-post-title"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="categoryId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-post-category">
                                  <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {categories?.map((category: ForumCategory) => (
                                  <SelectItem key={category.id} value={category.id}>
                                    {category.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="content"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Content *</FormLabel>
                            <FormControl>
                              <Textarea 
                                {...field}
                                placeholder="Share your experience, ask for advice, or offer support..."
                                className="min-h-[120px]"
                                data-testid="textarea-post-content"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="isAnonymous"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                data-testid="checkbox-anonymous-post"
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Post anonymously (recommended)</FormLabel>
                              <p className="text-sm text-muted-foreground">
                                Your identity will be hidden from other users
                              </p>
                            </div>
                          </FormItem>
                        )}
                      />

                      <Alert>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          Posts are reviewed by moderators before being published to ensure a safe environment for all users.
                        </AlertDescription>
                      </Alert>

                      <div className="flex space-x-2">
                        <Button 
                          type="submit" 
                          disabled={createPostMutation.isPending}
                          className="gradient-primary text-white"
                          data-testid="button-submit-post"
                        >
                          {createPostMutation.isPending ? "Submitting..." : "Submit Post"}
                        </Button>
                        <Button 
                          type="button" 
                          variant="outline"
                          onClick={() => setIsCreateDialogOpen(false)}
                          data-testid="button-cancel-post"
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>

              {/* Categories */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-heading">Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  {categoriesLoading ? (
                    <div className="space-y-2">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="animate-pulse bg-muted h-10 rounded"></div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Button
                        variant={!filters.categoryId ? "default" : "ghost"}
                        className="w-full justify-start"
                        onClick={() => setFilters(prev => ({ ...prev, categoryId: "" }))}
                        data-testid="button-category-all"
                      >
                        <Users className="mr-2" size={16} />
                        All Discussions
                      </Button>
                      {categories?.map((category: ForumCategory) => (
                        <Button
                          key={category.id}
                          variant={filters.categoryId === category.id ? "default" : "ghost"}
                          className="w-full justify-start"
                          onClick={() => setFilters(prev => ({ ...prev, categoryId: category.id }))}
                          data-testid={`button-category-${category.name.toLowerCase().replace(/\s+/g, '-')}`}
                        >
                          <div 
                            className="w-3 h-3 rounded-full mr-2" 
                            style={{ backgroundColor: category.color }}
                          />
                          {category.name}
                        </Button>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Community Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-heading">Community Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Active Posts</span>
                    <span className="font-semibold">{posts?.length || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Categories</span>
                    <span className="font-semibold">{categories?.length || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Moderators Online</span>
                    <span className="font-semibold text-green-600">3</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Search and Filters */}
              <Card className="mb-6">
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                      <Input
                        placeholder="Search discussions..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                        data-testid="input-search-posts"
                      />
                    </div>
                    <Select 
                      value={filters.sortBy} 
                      onValueChange={(value) => setFilters(prev => ({ ...prev, sortBy: value as any }))}
                    >
                      <SelectTrigger className="w-48" data-testid="select-sort-posts">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {sortOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Posts List */}
              <div className="space-y-4">
                {postsLoading ? (
                  [...Array(5)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="bg-muted h-32 rounded-lg"></div>
                    </div>
                  ))
                ) : filteredPosts.length > 0 ? (
                  filteredPosts.map((post: ForumPostType) => (
                    <ForumPost
                      key={post.id}
                      post={post}
                      onUpvote={handleUpvote}
                      data-testid={`forum-post-${post.id}`}
                    />
                  ))
                ) : (
                  <div className="text-center py-12">
                    <MessageSquare className="mx-auto text-muted-foreground mb-4" size={64} />
                    <h3 className="text-xl font-semibold text-foreground mb-2">No Discussions Yet</h3>
                    <p className="text-muted-foreground mb-6">
                      {searchTerm 
                        ? `No posts match your search "${searchTerm}"`
                        : filters.categoryId
                        ? "No posts in this category yet"
                        : "Be the first to start a conversation!"
                      }
                    </p>
                    <Button 
                      onClick={() => setIsCreateDialogOpen(true)}
                      className="gradient-primary text-white"
                      data-testid="button-create-first-post"
                    >
                      <Plus className="mr-2" size={18} />
                      Create First Post
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
