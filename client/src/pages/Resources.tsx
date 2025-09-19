import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/Header";
import ResourceCard from "@/components/resources/ResourceCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, 
  BookOpen, 
  Video, 
  Headphones, 
  FileText, 
  Filter,
  Download,
  Star,
  Clock,
  Globe
} from "lucide-react";
import type { Resource, ResourceFilters } from "@/types";

/**
 * Resources Page - Comprehensive mental health resource library
 * Features filtering, search, categories, and multiple content types
 */
export default function Resources() {
  const [filters, setFilters] = useState<ResourceFilters>({
    category: "",
    type: "",
    language: "en",
    search: ""
  });
  const [activeCategory, setActiveCategory] = useState("all");

  // Fetch resources with filters
  const { data: resources, isLoading } = useQuery({
    queryKey: ["/api/resources", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.category) params.append("category", filters.category);
      if (filters.type) params.append("type", filters.type);
      if (filters.language) params.append("language", filters.language);
      
      const response = await fetch(`/api/resources?${params.toString()}`);
      return await response.json();
    },
  });

  // Fetch featured resources
  const { data: featuredResources } = useQuery({
    queryKey: ["/api/resources/featured"],
  });

  // Search resources
  const { data: searchResults, isLoading: searchLoading } = useQuery({
    queryKey: ["/api/resources/search", filters.search],
    queryFn: async () => {
      if (!filters.search) return [];
      const response = await fetch(`/api/resources/search?q=${encodeURIComponent(filters.search)}`);
      return await response.json();
    },
    enabled: !!filters.search,
  });

  // Resource categories
  const categories = [
    { id: "all", name: "All Resources", icon: BookOpen, count: resources?.length || 0 },
    { id: "anxiety", name: "Anxiety", icon: BookOpen, count: resources?.filter((r: Resource) => r.category === "anxiety").length || 0 },
    { id: "depression", name: "Depression", icon: BookOpen, count: resources?.filter((r: Resource) => r.category === "depression").length || 0 },
    { id: "stress", name: "Stress Management", icon: BookOpen, count: resources?.filter((r: Resource) => r.category === "stress").length || 0 },
    { id: "sleep", name: "Sleep & Rest", icon: BookOpen, count: resources?.filter((r: Resource) => r.category === "sleep").length || 0 },
    { id: "academic", name: "Academic Support", icon: BookOpen, count: resources?.filter((r: Resource) => r.category === "academic").length || 0 },
    { id: "general", name: "General Wellness", icon: BookOpen, count: resources?.filter((r: Resource) => r.category === "general").length || 0 },
  ];

  // Content types
  const contentTypes = [
    { value: "", label: "All Types", icon: BookOpen },
    { value: "video", label: "Videos", icon: Video },
    { value: "audio", label: "Audio", icon: Headphones },
    { value: "pdf", label: "PDFs", icon: FileText },
    { value: "article", label: "Articles", icon: BookOpen },
  ];

  // Language options
  const languages = [
    { value: "en", label: "English" },
    { value: "es", label: "Spanish" },
    { value: "fr", label: "French" },
    { value: "hi", label: "Hindi" },
    { value: "zh", label: "Chinese" },
  ];

  // Filter resources based on active category and search
  const getFilteredResources = () => {
    let filtered = filters.search ? searchResults || [] : resources || [];
    
    if (activeCategory !== "all") {
      filtered = filtered.filter((resource: Resource) => resource.category === activeCategory);
    }
    
    return filtered;
  };

  const handleSearchChange = (value: string) => {
    setFilters(prev => ({ ...prev, search: value }));
  };

  const handleFilterChange = (key: keyof ResourceFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const filteredResources = getFilteredResources();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4 font-heading">Mental Health Resources</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Access curated videos, audio guides, articles, and PDFs on mental health topics in multiple languages
            </p>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar - Filters */}
            <div className="lg:col-span-1 space-y-6">
              {/* Search */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-heading flex items-center">
                    <Search className="mr-2" size={20} />
                    Search Resources
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                    <Input
                      placeholder="Search for topics, keywords..."
                      value={filters.search}
                      onChange={(e) => handleSearchChange(e.target.value)}
                      className="pl-10"
                      data-testid="input-search-resources"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Filters */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-heading flex items-center">
                    <Filter className="mr-2" size={20} />
                    Filters
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Content Type Filter */}
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Content Type</label>
                    <Select 
                      value={filters.type} 
                      onValueChange={(value) => handleFilterChange("type", value)}
                    >
                      <SelectTrigger data-testid="select-content-type">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {contentTypes.map((type) => {
                          const IconComponent = type.icon;
                          return (
                            <SelectItem key={type.value} value={type.value}>
                              <div className="flex items-center space-x-2">
                                <IconComponent size={16} />
                                <span>{type.label}</span>
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Language Filter */}
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Language</label>
                    <Select 
                      value={filters.language} 
                      onValueChange={(value) => handleFilterChange("language", value)}
                    >
                      <SelectTrigger data-testid="select-language">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {languages.map((lang) => (
                          <SelectItem key={lang.value} value={lang.value}>
                            <div className="flex items-center space-x-2">
                              <Globe size={16} />
                              <span>{lang.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Clear Filters */}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => setFilters({ category: "", type: "", language: "en", search: "" })}
                    data-testid="button-clear-filters"
                  >
                    Clear All Filters
                  </Button>
                </CardContent>
              </Card>

              {/* Categories */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-heading">Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {categories.map((category) => {
                      const IconComponent = category.icon;
                      return (
                        <Button
                          key={category.id}
                          variant={activeCategory === category.id ? "default" : "ghost"}
                          className="w-full justify-between"
                          onClick={() => setActiveCategory(category.id)}
                          data-testid={`button-category-${category.id}`}
                        >
                          <div className="flex items-center space-x-2">
                            <IconComponent size={16} />
                            <span>{category.name}</span>
                          </div>
                          <Badge variant="secondary">{category.count}</Badge>
                        </Button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <Tabs defaultValue="browse" className="space-y-6">
                <TabsList>
                  <TabsTrigger value="browse" data-testid="tab-browse-resources">Browse</TabsTrigger>
                  <TabsTrigger value="featured" data-testid="tab-featured-resources">Featured</TabsTrigger>
                </TabsList>

                {/* Browse Resources */}
                <TabsContent value="browse">
                  <div className="space-y-6">
                    {/* Results Header */}
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-2xl font-bold text-foreground font-heading">
                          {filters.search ? `Search Results` : categories.find(c => c.id === activeCategory)?.name}
                        </h2>
                        <p className="text-muted-foreground">
                          {isLoading || searchLoading ? "Loading..." : `${filteredResources.length} resources found`}
                        </p>
                      </div>
                    </div>

                    {/* Resources Grid */}
                    {isLoading || searchLoading ? (
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                          <div key={i} className="animate-pulse">
                            <div className="bg-muted h-64 rounded-lg"></div>
                          </div>
                        ))}
                      </div>
                    ) : filteredResources.length > 0 ? (
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredResources.map((resource: Resource) => (
                          <ResourceCard 
                            key={resource.id} 
                            resource={resource}
                            data-testid={`resource-card-${resource.id}`}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <BookOpen className="mx-auto text-muted-foreground mb-4" size={64} />
                        <h3 className="text-xl font-semibold text-foreground mb-2">No Resources Found</h3>
                        <p className="text-muted-foreground mb-4">
                          {filters.search 
                            ? `No resources match your search "${filters.search}"`
                            : "No resources available in this category"
                          }
                        </p>
                        <Button 
                          variant="outline"
                          onClick={() => {
                            setFilters({ category: "", type: "", language: "en", search: "" });
                            setActiveCategory("all");
                          }}
                          data-testid="button-view-all-resources"
                        >
                          View All Resources
                        </Button>
                      </div>
                    )}
                  </div>
                </TabsContent>

                {/* Featured Resources */}
                <TabsContent value="featured">
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold text-foreground mb-2 font-heading">Featured Resources</h2>
                      <p className="text-muted-foreground">
                        Hand-picked resources recommended by our mental health professionals
                      </p>
                    </div>

                    {featuredResources && featuredResources.length > 0 ? (
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {featuredResources.map((resource: Resource) => (
                          <ResourceCard 
                            key={resource.id} 
                            resource={resource}
                            featured={true}
                            data-testid={`featured-resource-${resource.id}`}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Star className="mx-auto text-muted-foreground mb-4" size={64} />
                        <h3 className="text-xl font-semibold text-foreground mb-2">No Featured Resources</h3>
                        <p className="text-muted-foreground">Check back soon for featured content</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
