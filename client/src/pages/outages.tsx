import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Zap, Droplets, RefreshCw, Clock, AlertTriangle, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { AppHeader } from "@/components/layout/app-header";
import { BottomNavigation } from "@/components/layout/bottom-navigation";
import { apiRequest } from "@/lib/queryClient";
import type { Outage } from "@shared/schema";

export default function Outages() {
  const [activeTab, setActiveTab] = useState("all");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: outages, isLoading } = useQuery<Outage[]>({
    queryKey: activeTab === "all" ? ['/api/outages'] : ['/api/outages', { type: activeTab }],
  });

  const syncMeskiMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('GET', '/api/outages/meski/sync');
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/outages'] });
      toast({
        title: "Başarılı",
        description: `${data.outages?.length || 0} MESKİ kesintisi güncellendi`,
      });
    },
    onError: () => {
      toast({
        title: "Hata",
        description: "MESKİ verileri güncellenirken hata oluştu.",
        variant: "destructive",
      });
    },
  });

  const getOutageIcon = (type: string) => {
    return type === "water" ? Droplets : Zap;
  };

  const getOutageColor = (type: string) => {
    return type === "water" ? "text-blue-600 bg-blue-100" : "text-yellow-600 bg-yellow-100";
  };

  const formatDateTime = (date: Date | string | null) => {
    if (!date) return "Bilinmiyor";
    const d = new Date(date);
    return d.toLocaleDateString('tr-TR', { 
      day: '2-digit', 
      month: '2-digit', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const calculateDuration = (startDate: Date | string | null, endDate: Date | string | null) => {
    if (!startDate || !endDate) return "Süre belirsiz";
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffHours = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60));
    return `${diffHours} saat`;
  };

  const isOutageActive = (startDate: Date | string | null, endDate: Date | string | null) => {
    if (!startDate || !endDate) return true;
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    return now >= start && now <= end;
  };

  const filteredOutages = outages?.filter(outage => {
    if (activeTab === "all") return true;
    return outage.type === activeTab;
  }) || [];

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
        <section className="p-4 bg-gradient-to-r from-destructive to-red-600 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-medium">Kesintiler</h2>
                <p className="text-sm opacity-90">Su ve Elektrik Kesintileri</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => syncMeskiMutation.mutate()}
              disabled={syncMeskiMutation.isPending}
              className="text-white border-white/20 hover:bg-white/20"
              data-testid="button-sync-meski"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${syncMeskiMutation.isPending ? 'animate-spin' : ''}`} />
              Güncelle
            </Button>
          </div>
        </section>

        {/* Tabs */}
        <section className="p-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all" data-testid="tab-all">Tümü</TabsTrigger>
              <TabsTrigger value="water" data-testid="tab-water">Su</TabsTrigger>
              <TabsTrigger value="electricity" data-testid="tab-electricity">Elektrik</TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeTab} className="mt-4">
              {isLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Card key={i} className="shadow-material">
                      <CardContent className="p-4">
                        <div className="animate-pulse">
                          <div className="h-4 bg-muted rounded w-2/3 mb-2"></div>
                          <div className="h-3 bg-muted rounded w-full mb-2"></div>
                          <div className="h-3 bg-muted rounded w-1/2"></div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : filteredOutages.length > 0 ? (
                <div className="space-y-4">
                  {filteredOutages.map((outage) => {
                    const Icon = getOutageIcon(outage.type);
                    const colorClasses = getOutageColor(outage.type);
                    const active = isOutageActive(outage.startDate, outage.endDate);
                    
                    return (
                      <Card key={outage.id} className="shadow-material" data-testid={`card-outage-${outage.id}`}>
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${colorClasses}`}>
                                <Icon className="w-5 h-5" />
                              </div>
                              <div>
                                <CardTitle className="text-sm" data-testid={`text-outage-title-${outage.id}`}>
                                  {outage.title}
                                </CardTitle>
                                <div className="flex items-center gap-2 mt-1">
                                  {active ? (
                                    <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                                      Aktif
                                    </span>
                                  ) : (
                                    <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
                                      Tamamlandı
                                    </span>
                                  )}
                                  {outage.source && (
                                    <span className="text-xs text-muted-foreground">
                                      {outage.source === 'meski' ? 'MESKİ' : 'Toroslar EDAŞ'}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                        
                        <CardContent>
                          <p className="text-sm text-foreground mb-3" data-testid={`text-outage-description-${outage.id}`}>
                            {outage.description}
                          </p>
                          
                          {outage.affectedAreas && outage.affectedAreas.length > 0 && (
                            <div className="mb-3">
                              <div className="flex items-center gap-1 mb-2">
                                <MapPin className="w-3 h-3 text-muted-foreground" />
                                <span className="text-xs font-medium text-muted-foreground">Etkilenen Bölgeler:</span>
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {outage.affectedAreas.map((area, index) => (
                                  <span 
                                    key={index}
                                    className="text-xs bg-muted px-2 py-1 rounded-md"
                                    data-testid={`badge-area-${area}`}
                                  >
                                    {area}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
                            <div>
                              <div className="flex items-center gap-1 mb-1">
                                <Clock className="w-3 h-3" />
                                <span>Başlangıç:</span>
                              </div>
                              <span className="font-medium">
                                {formatDateTime(outage.startDate)}
                              </span>
                            </div>
                            <div>
                              <div className="flex items-center gap-1 mb-1">
                                <Clock className="w-3 h-3" />
                                <span>Bitiş:</span>
                              </div>
                              <span className="font-medium">
                                {formatDateTime(outage.endDate)}
                              </span>
                            </div>
                          </div>
                          
                          {outage.startDate && outage.endDate && (
                            <div className="mt-2 text-xs text-muted-foreground">
                              <span className="font-medium">Süre: {calculateDuration(outage.startDate, outage.endDate)}</span>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <Card className="shadow-material">
                  <CardContent className="p-8 text-center">
                    {activeTab === "water" ? (
                      <Droplets className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    ) : activeTab === "electricity" ? (
                      <Zap className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    ) : (
                      <AlertTriangle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    )}
                    <h4 className="font-medium mb-2">Kesinti bulunamadı</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      {activeTab === "water" 
                        ? "Şu anda aktif su kesintisi bulunmuyor."
                        : activeTab === "electricity"
                        ? "Şu anda aktif elektrik kesintisi bulunmuyor."
                        : "Şu anda aktif kesinti bulunmuyor."
                      }
                    </p>
                    <Button 
                      onClick={() => syncMeskiMutation.mutate()}
                      disabled={syncMeskiMutation.isPending}
                      data-testid="button-refresh-outages"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Yenile
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </section>

        {/* Info Card */}
        <section className="p-4">
          <Card className="shadow-material bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <h4 className="font-medium text-sm mb-2 text-blue-900 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Kesinti Bilgisi
              </h4>
              <ul className="text-xs text-blue-800 space-y-1">
                <li>• Su kesintileri MESKİ'den anlık olarak çekilmektedir</li>
                <li>• Elektrik kesintileri için Toroslar EDAŞ web sitesini kontrol edin</li>
                <li>• Plansız kesintiler için 186 (EDAŞ) veya 185 (MESKİ) arayın</li>
                <li>• Kesintiler genellikle 48 saat önceden duyurulur</li>
              </ul>
            </CardContent>
          </Card>
        </section>
      </main>

      <BottomNavigation />
    </div>
  );
}