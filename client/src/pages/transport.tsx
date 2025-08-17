import { useQuery } from "@tanstack/react-query";
import { Clock, MapPin, Navigation } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AppHeader } from "@/components/layout/app-header";
import { BottomNavigation } from "@/components/layout/bottom-navigation";
import { BusInfo } from "@/components/transport/bus-info";
import type { BusRoute } from "@shared/schema";

export default function Transport() {
  const { data: busRoutes, isLoading } = useQuery<BusRoute[]>({
    queryKey: ['/api/bus-routes'],
  });

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
        <section className="p-4 bg-gradient-to-r from-primary to-blue-600 text-white">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Navigation className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-medium">Ulaşım</h2>
              <p className="text-sm opacity-90">Otobüs ve Dolmuş Bilgileri</p>
            </div>
          </div>
        </section>

        {/* Quick Access */}
        <section className="p-4">
          <div className="grid grid-cols-2 gap-3 mb-6">
            <Button 
              variant="outline" 
              className="h-auto p-4 flex flex-col items-center gap-2"
              data-testid="button-nearby-stops"
            >
              <MapPin className="w-5 h-5 text-primary" />
              <span className="text-sm">Yakın Duraklar</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto p-4 flex flex-col items-center gap-2"
              data-testid="button-route-planner"
            >
              <Navigation className="w-5 h-5 text-primary" />
              <span className="text-sm">Rota Planlayıcı</span>
            </Button>
          </div>
        </section>

        {/* Live Bus Information */}
        <section className="p-4">
          <h3 className="text-lg font-medium mb-4 text-foreground">Canlı Otobüs Bilgileri</h3>
          
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="shadow-material">
                  <CardContent className="p-4">
                    <div className="animate-pulse">
                      <div className="h-4 bg-muted rounded w-1/3 mb-2"></div>
                      <div className="h-3 bg-muted rounded w-2/3 mb-1"></div>
                      <div className="h-3 bg-muted rounded w-1/2"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : busRoutes && busRoutes.length > 0 ? (
            <div className="space-y-4">
              {busRoutes.map((route, index) => (
                <BusInfo 
                  key={route.id} 
                  route={route} 
                  estimatedArrival={route.estimatedTime || Math.floor(Math.random() * 15) + 1}
                />
              ))}
            </div>
          ) : (
            <Card className="shadow-material">
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground text-center">
                  Şu anda aktif otobüs bilgisi bulunamadı
                </p>
              </CardContent>
            </Card>
          )}
        </section>

        {/* Bus Stops */}
        <section className="p-4">
          <h3 className="text-lg font-medium mb-4 text-foreground">Yakın Duraklar</h3>
          
          <div className="space-y-3">
            {[
              { name: "Cumhuriyet Meydanı", distance: "50m", routes: ["12", "25", "34"] },
              { name: "Atatürk Anıtı", distance: "200m", routes: ["12", "18"] },
              { name: "Belediye Binası", distance: "350m", routes: ["25", "34"] }
            ].map((stop, index) => (
              <Card key={index} className="shadow-material">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-sm" data-testid={`text-stop-name-${index}`}>
                        {stop.name}
                      </h4>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                        <MapPin className="w-3 h-3" />
                        <span>{stop.distance}</span>
                      </div>
                      <div className="flex gap-1 mt-2">
                        {stop.routes.map((route) => (
                          <span 
                            key={route}
                            className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-md"
                            data-testid={`badge-route-${route}`}
                          >
                            {route}
                          </span>
                        ))}
                      </div>
                    </div>
                    <Button variant="outline" size="sm" data-testid={`button-directions-${index}`}>
                      Yol Tarifi
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* QR Code Scanner Info */}
        <section className="p-4">
          <Card className="shadow-material bg-accent/5 border-accent/20">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Clock className="w-4 h-4 text-accent" />
                QR Kod ile Durak Bilgisi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                Duraktaki QR kodu okutarak o durağa gelecek otobüslerin anlık bilgilerini öğrenebilirsiniz.
              </p>
              <Button className="w-full" data-testid="button-scan-qr">
                QR Kod Tarayıcıyı Aç
              </Button>
            </CardContent>
          </Card>
        </section>
      </main>

      <BottomNavigation />
    </div>
  );
}
