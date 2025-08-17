import { Clock, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { BusRoute } from "@shared/schema";

interface BusInfoProps {
  route: BusRoute;
  estimatedArrival?: number;
}

export function BusInfo({ route, estimatedArrival }: BusInfoProps) {
  return (
    <Card className="shadow-material">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-xs font-medium">
              {route.routeNumber}
            </div>
            <span className="font-medium text-sm">{route.routeName}</span>
          </div>
          <span className="text-xs text-muted-foreground">Şimdi</span>
        </div>
        
        <div className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="flex flex-col">
              <span className="text-sm font-medium">{route.startLocation} - {route.endLocation}</span>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="w-3 h-3" />
                <span>Cumhuriyet Meydanı Durağı</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <span className="text-sm font-medium text-accent">
              {estimatedArrival ? `${estimatedArrival} dk` : 'Bilinmiyor'}
            </span>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              <span>{estimatedArrival && estimatedArrival <= 5 ? 'Yaklaşıyor' : 'Yolda'}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
