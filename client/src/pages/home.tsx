import { useQuery } from "@tanstack/react-query";
import { MapPin, Megaphone, QrCode } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AppHeader } from "@/components/layout/app-header";
import { BottomNavigation } from "@/components/layout/bottom-navigation";
import { BusinessCard } from "@/components/business/business-card";
import { BusInfo } from "@/components/transport/bus-info";
import { PostCard } from "@/components/community/post-card";
import { QUICK_ACTIONS } from "@/lib/constants";
import { Link } from "wouter";
import type { Business, BusRoute, Announcement, CommunityPost } from "@shared/schema";

export default function Home() {
  const { data: featuredBusinesses, isLoading: businessesLoading } = useQuery<Business[]>({
    queryKey: ['/api/businesses/featured'],
  });

  const { data: busRoutes, isLoading: routesLoading } = useQuery<BusRoute[]>({
    queryKey: ['/api/bus-routes'],
  });

  const { data: announcements, isLoading: announcementsLoading } = useQuery<Announcement[]>({
    queryKey: ['/api/announcements?limit=3'],
  });

  const { data: communityPosts, isLoading: postsLoading } = useQuery<CommunityPost[]>({
    queryKey: ['/api/community-posts?limit=3'],
  });

  return (
    <div className="max-w-md mx-auto bg-card min-h-screen relative">
      {/* Status Bar Simulation */}
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
        {/* Welcome Section */}
        <section className="p-4 bg-gradient-to-r from-primary to-blue-600 text-white">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-medium">Merhaba!</h2>
              <p className="text-sm opacity-90">Tarsus, Mersin</p>
            </div>
          </div>
          <p className="text-sm opacity-90">Bugün nasıl yardımcı olabiliriz?</p>
        </section>

        {/* Quick Actions */}
        <section className="p-4">
          <h3 className="text-lg font-medium mb-4 text-foreground">Hızlı Erişim</h3>
          <div className="grid grid-cols-2 gap-3">
            {QUICK_ACTIONS.map((action) => {
              const Icon = action.icon;
              const colorClasses = {
                primary: "bg-primary/10 text-primary",
                secondary: "bg-secondary/10 text-secondary", 
                destructive: "bg-destructive/10 text-destructive",
                accent: "bg-accent/10 text-accent"
              };

              return (
                <Link key={action.id} href={action.path}>
                  <Button
                    variant="ghost"
                    className="bg-card p-4 rounded-xl shadow-material hover:shadow-material-lg transition-all duration-200 h-auto w-full"
                    data-testid={`button-quick-${action.id}`}
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${colorClasses[action.color as keyof typeof colorClasses]}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="font-medium text-sm">{action.title}</span>
                      <span className="text-xs text-muted-foreground">{action.subtitle}</span>
                    </div>
                  </Button>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Live Updates */}
        <section className="p-4">
          <h3 className="text-lg font-medium mb-4 text-foreground">Canlı Bilgiler</h3>
          
          {/* Transport Info */}
          <div className="mb-4">
            {routesLoading ? (
              <Card className="shadow-material">
                <CardContent className="p-4">
                  <div className="animate-pulse">
                    <div className="h-4 bg-muted rounded w-1/3 mb-2"></div>
                    <div className="h-3 bg-muted rounded w-2/3"></div>
                  </div>
                </CardContent>
              </Card>
            ) : busRoutes && busRoutes.length > 0 ? (
              <BusInfo route={busRoutes[0]} estimatedArrival={3} />
            ) : (
              <Card className="shadow-material">
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">Ulaşım bilgisi bulunamadı</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Announcements */}
          <Card className="shadow-material mb-4">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Megaphone className="w-4 h-4 text-secondary" />
                <span className="font-medium">Belediye Duyuruları</span>
              </div>
              
              {announcementsLoading ? (
                <div className="animate-pulse">
                  <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-muted rounded w-full"></div>
                </div>
              ) : announcements && announcements.length > 0 ? (
                <div className="space-y-3">
                  {announcements.map((announcement) => (
                    <div 
                      key={announcement.id} 
                      className="border-l-4 border-secondary pl-3 py-2"
                      data-testid={`announcement-${announcement.id}`}
                    >
                      <h4 className="text-sm font-medium">{announcement.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1">{announcement.content}</p>
                      <span className="text-xs text-muted-foreground">
                        {announcement.createdAt ? 
                          new Date(announcement.createdAt).toLocaleDateString('tr-TR') : 
                          'Tarih bilinmiyor'
                        }
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Duyuru bulunamadı</p>
              )}
            </CardContent>
          </Card>
        </section>

        {/* Featured Businesses */}
        <section className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-foreground">Öne Çıkan İşletmeler</h3>
            <Link href="/business">
              <Button variant="ghost" className="text-primary text-sm font-medium h-auto p-1" data-testid="button-view-all-businesses">
                Tümünü Gör
              </Button>
            </Link>
          </div>
          
          <div className="flex gap-3 overflow-x-auto pb-2">
            {businessesLoading ? (
              Array.from({ length: 2 }).map((_, i) => (
                <Card key={i} className="shadow-material min-w-[200px] flex-shrink-0">
                  <CardContent className="p-3">
                    <div className="animate-pulse">
                      <div className="w-full h-20 bg-muted rounded-lg mb-2"></div>
                      <div className="h-4 bg-muted rounded w-2/3 mb-1"></div>
                      <div className="h-3 bg-muted rounded w-1/2"></div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : featuredBusinesses && featuredBusinesses.length > 0 ? (
              featuredBusinesses.map((business) => (
                <BusinessCard key={business.id} business={business} />
              ))
            ) : (
              <Card className="shadow-material min-w-[200px]">
                <CardContent className="p-3">
                  <p className="text-sm text-muted-foreground">İşletme bulunamadı</p>
                </CardContent>
              </Card>
            )}
          </div>
        </section>

        {/* Community Updates */}
        <section className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-foreground">Mahalle Haberleri</h3>
            <Link href="/community">
              <Button variant="ghost" className="text-primary text-sm font-medium h-auto p-1" data-testid="button-view-forum">
                Forum
              </Button>
            </Link>
          </div>
          
          <div className="space-y-3">
            {postsLoading ? (
              Array.from({ length: 2 }).map((_, i) => (
                <Card key={i} className="shadow-material">
                  <CardContent className="p-4">
                    <div className="animate-pulse">
                      <div className="h-4 bg-muted rounded w-1/3 mb-2"></div>
                      <div className="h-3 bg-muted rounded w-full mb-1"></div>
                      <div className="h-3 bg-muted rounded w-2/3"></div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : communityPosts && communityPosts.length > 0 ? (
              communityPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))
            ) : (
              <Card className="shadow-material">
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">Henüz gönderi yok</p>
                </CardContent>
              </Card>
            )}
          </div>
        </section>
      </main>

      <BottomNavigation />

      {/* Floating Action Button */}
      <Button
        className="fixed bottom-20 right-4 w-14 h-14 bg-secondary hover:bg-secondary/90 text-white rounded-full shadow-material-lg transition-all duration-200"
        data-testid="button-qr-scanner"
      >
        <QrCode className="w-6 h-6" />
      </Button>
    </div>
  );
}
