import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Video, 
  Headphones, 
  FileText, 
  BookOpen, 
  Play, 
  Download, 
  ExternalLink,
  Clock,
  Star,
  Globe
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Resource } from "@/types";

interface ResourceCardProps {
  resource: Resource;
  featured?: boolean;
  className?: string;
  "data-testid"?: string;
}

/**
 * Resource Card Component - Individual resource display with actions
 * Features content type icons, duration, language, and access buttons
 */
export default function ResourceCard({ 
  resource, 
  featured = false, 
  className,
  "data-testid": testId
}: ResourceCardProps) {
  
  // Get icon for resource type
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "video": return Video;
      case "audio": return Headphones;
      case "pdf": return FileText;
      case "article": return BookOpen;
      default: return BookOpen;
    }
  };

  // Get action button text and icon
  const getActionButton = (type: string) => {
    switch (type) {
      case "video":
        return { text: "Watch Video", icon: Play, variant: "default" as const };
      case "audio":
        return { text: "Listen Now", icon: Play, variant: "default" as const };
      case "pdf":
        return { text: "Download PDF", icon: Download, variant: "outline" as const };
      case "article":
        return { text: "Read Article", icon: ExternalLink, variant: "outline" as const };
      default:
        return { text: "View Resource", icon: ExternalLink, variant: "outline" as const };
    }
  };

  // Get category color
  const getCategoryColor = (category: string) => {
    const colors = {
      anxiety: "bg-blue-100 text-blue-800",
      depression: "bg-purple-100 text-purple-800",
      stress: "bg-orange-100 text-orange-800",
      sleep: "bg-indigo-100 text-indigo-800",
      academic: "bg-green-100 text-green-800",
      general: "bg-gray-100 text-gray-800",
    };
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  // Format duration
  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes}min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}min`;
  };

  const TypeIcon = getTypeIcon(resource.type);
  const actionButton = getActionButton(resource.type);
  const ActionIcon = actionButton.icon;

  return (
    <Card 
      className={cn(
        "group hover:shadow-lg transition-all duration-300 cursor-pointer",
        featured && "ring-2 ring-primary/20 bg-primary/5",
        className
      )}
      data-testid={testId}
    >
      {/* Thumbnail/Header */}
      <div className="relative">
        {resource.thumbnailUrl ? (
          <img
            src={resource.thumbnailUrl}
            alt={resource.title}
            className="w-full h-48 object-cover rounded-t-lg"
          />
        ) : (
          <div className="w-full h-48 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-t-lg flex items-center justify-center">
            <TypeIcon className="text-primary" size={48} />
          </div>
        )}
        
        {/* Featured Badge */}
        {featured && (
          <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
            <Star size={12} className="mr-1" />
            Featured
          </Badge>
        )}

        {/* Type Badge */}
        <Badge 
          variant="secondary" 
          className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm"
        >
          <TypeIcon size={12} className="mr-1" />
          {resource.type}
        </Badge>

        {/* Duration for video/audio */}
        {resource.duration && (resource.type === "video" || resource.type === "audio") && (
          <Badge 
            variant="secondary" 
            className="absolute bottom-3 right-3 bg-black/70 text-white"
          >
            <Clock size={12} className="mr-1" />
            {formatDuration(resource.duration)}
          </Badge>
        )}
      </div>

      <CardHeader className="pb-3">
        <div className="space-y-2">
          <div className="flex items-start justify-between">
            <h3 className="font-semibold text-foreground line-clamp-2 leading-tight">
              {resource.title}
            </h3>
          </div>
          
          <div className="flex items-center space-x-2">
            <Badge className={getCategoryColor(resource.category)} variant="secondary">
              {resource.category}
            </Badge>
            
            {resource.language !== "en" && (
              <Badge variant="outline" className="text-xs">
                <Globe size={10} className="mr-1" />
                {resource.language.toUpperCase()}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-4">
          {/* Description */}
          {resource.description && (
            <p className="text-sm text-muted-foreground line-clamp-3">
              {resource.description}
            </p>
          )}

          {/* Tags */}
          {resource.tags && resource.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {resource.tags.slice(0, 3).map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {resource.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{resource.tags.length - 3} more
                </Badge>
              )}
            </div>
          )}

          {/* Action Button */}
          <Button 
            variant={actionButton.variant}
            className="w-full group-hover:shadow-md transition-shadow"
            onClick={() => {
              if (resource.url) {
                window.open(resource.url, '_blank');
              }
            }}
            data-testid={`button-${actionButton.text.toLowerCase().replace(/\s+/g, '-')}`}
          >
            <ActionIcon size={16} className="mr-2" />
            {actionButton.text}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
