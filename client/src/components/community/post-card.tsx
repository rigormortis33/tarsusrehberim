import { Heart, MessageCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { CommunityPost } from "@shared/schema";

interface PostCardProps {
  post: CommunityPost;
}

export function PostCard({ post }: PostCardProps) {
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const formatTimeAgo = (date: Date | null | undefined) => {
    if (!date) return 'Bilinmiyor';
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 60) {
      return `${diffMins} dk`;
    } else if (diffMins < 1440) {
      return `${Math.floor(diffMins / 60)} sa`;
    } else {
      return `${Math.floor(diffMins / 1440)} gün`;
    }
  };

  return (
    <Card className="shadow-material" data-testid={`card-post-${post.id}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-medium">
              {getInitials(post.authorId || 'Unknown')}
            </span>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-medium">Anonim K.</span>
              <span className="text-xs text-muted-foreground">{post.neighborhood || 'Tarsus'}</span>
              <span className="text-xs text-muted-foreground">·</span>
              <span className="text-xs text-muted-foreground">
                {formatTimeAgo(post.createdAt)}
              </span>
            </div>
            
            {post.title && (
              <h4 className="text-sm font-medium mb-1" data-testid={`text-post-title-${post.id}`}>
                {post.title}
              </h4>
            )}
            
            <p className="text-sm text-foreground mb-2" data-testid={`text-post-content-${post.id}`}>
              {post.content}
            </p>
            
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-1 text-muted-foreground text-xs h-auto p-1"
                data-testid={`button-like-${post.id}`}
              >
                <Heart className="w-4 h-4" />
                <span>{post.likes || 0}</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-1 text-muted-foreground text-xs h-auto p-1"
                data-testid={`button-comment-${post.id}`}
              >
                <MessageCircle className="w-4 h-4" />
                <span>{post.comments || 0}</span>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
