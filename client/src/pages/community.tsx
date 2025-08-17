import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MessageCircle, Plus, Send } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { AppHeader } from "@/components/layout/app-header";
import { BottomNavigation } from "@/components/layout/bottom-navigation";
import { PostCard } from "@/components/community/post-card";
import { apiRequest } from "@/lib/queryClient";
import type { CommunityPost, InsertCommunityPost } from "@shared/schema";

export default function Community() {
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [newPost, setNewPost] = useState({ title: "", content: "", neighborhood: "" });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: posts, isLoading } = useQuery<CommunityPost[]>({
    queryKey: ['/api/community-posts'],
  });

  const createPostMutation = useMutation({
    mutationFn: async (post: InsertCommunityPost) => {
      const response = await apiRequest('POST', '/api/community-posts', post);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/community-posts'] });
      setNewPost({ title: "", content: "", neighborhood: "" });
      setShowCreatePost(false);
      toast({
        title: "Başarılı",
        description: "Gönderiniz paylaşıldı!",
      });
    },
    onError: () => {
      toast({
        title: "Hata",
        description: "Gönderi paylaşılırken bir hata oluştu.",
        variant: "destructive",
      });
    },
  });

  const handleCreatePost = () => {
    if (!newPost.content.trim()) {
      toast({
        title: "Uyarı", 
        description: "Lütfen gönderi içeriği yazın.",
        variant: "destructive",
      });
      return;
    }

    createPostMutation.mutate({
      title: newPost.title.trim() || undefined,
      content: newPost.content.trim(),
      neighborhood: newPost.neighborhood.trim() || undefined,
      authorId: "anonymous", // In real app, this would be from auth
    });
  };

  return (
    <div className="max-w-md mx-auto bg-card min-h-screen relative">
      <div className="bg-primary text-white px-4 py-1 text-xs flex justify-between items-center">
        <span>9:41</span>
        <span className="flex items-center gap-1">
          <span>●●●</span>
          <span>📶</span>
          <span>🔋</span>
        </span>
      </div>

      <AppHeader />

      <main className="pb-20 bg-background">
        {/* Page Header */}
        <section className="p-4 bg-gradient-to-r from-accent to-green-600 text-white">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <MessageCircle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-medium">Topluluk</h2>
              <p className="text-sm opacity-90">Mahalle Forumu</p>
            </div>
          </div>
        </section>

        {/* Create Post */}
        <section className="p-4">
          {!showCreatePost ? (
            <Button 
              onClick={() => setShowCreatePost(true)}
              className="w-full mb-4 bg-accent hover:bg-accent/90"
              data-testid="button-create-post"
            >
              <Plus className="w-4 h-4 mr-2" />
              Yeni Gönderi Oluştur
            </Button>
          ) : (
            <Card className="shadow-material mb-4">
              <CardHeader>
                <CardTitle className="text-sm">Yeni Gönderi</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Input
                  placeholder="Başlık (isteğe bağlı)"
                  value={newPost.title}
                  onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
                  data-testid="input-post-title"
                />
                <Input
                  placeholder="Mahalle (isteğe bağlı)"
                  value={newPost.neighborhood}
                  onChange={(e) => setNewPost(prev => ({ ...prev, neighborhood: e.target.value }))}
                  data-testid="input-post-neighborhood"
                />
                <Textarea
                  placeholder="Ne düşünüyorsunuz?"
                  value={newPost.content}
                  onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                  rows={3}
                  data-testid="textarea-post-content"
                />
                <div className="flex gap-2">
                  <Button 
                    onClick={handleCreatePost}
                    disabled={createPostMutation.isPending}
                    className="flex-1"
                    data-testid="button-submit-post"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {createPostMutation.isPending ? "Paylaşılıyor..." : "Paylaş"}
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setShowCreatePost(false)}
                    data-testid="button-cancel-post"
                  >
                    İptal
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </section>

        {/* Community Guidelines */}
        <section className="px-4 mb-4">
          <Card className="shadow-material bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <h4 className="font-medium text-sm mb-2 text-blue-900">Topluluk Kuralları</h4>
              <ul className="text-xs text-blue-800 space-y-1">
                <li>• Saygılı bir dil kullanın</li>
                <li>• Kişisel bilgilerinizi paylaşmayın</li>
                <li>• Spam ve reklam yapmayın</li>
                <li>• Komşularınıza yardımcı olun</li>
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* Posts Feed */}
        <section className="p-4">
          <h3 className="text-lg font-medium mb-4 text-foreground">Son Gönderiler</h3>
          
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="shadow-material">
                  <CardContent className="p-4">
                    <div className="animate-pulse">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 bg-muted rounded-full"></div>
                        <div className="flex-1">
                          <div className="h-3 bg-muted rounded w-1/3 mb-1"></div>
                          <div className="h-3 bg-muted rounded w-1/4"></div>
                        </div>
                      </div>
                      <div className="h-4 bg-muted rounded w-full mb-2"></div>
                      <div className="h-4 bg-muted rounded w-3/4"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : posts && posts.length > 0 ? (
            <div className="space-y-4">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <Card className="shadow-material">
              <CardContent className="p-8 text-center">
                <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h4 className="font-medium mb-2">Henüz gönderi yok</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  İlk gönderinizi paylaşarak tartışmayı başlatın!
                </p>
                <Button 
                  onClick={() => setShowCreatePost(true)}
                  data-testid="button-create-first-post"
                >
                  İlk Gönderinizi Paylaşın
                </Button>
              </CardContent>
            </Card>
          )}
        </section>
      </main>

      <BottomNavigation />
    </div>
  );
}
