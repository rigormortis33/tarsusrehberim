import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Business } from "@shared/schema";

interface BusinessCardProps {
  business: Business;
  onClick?: () => void;
}

export function BusinessCard({ business, onClick }: BusinessCardProps) {
  return (
    <Card 
      className="shadow-material hover:shadow-material-lg transition-all duration-200 cursor-pointer min-w-[200px] flex-shrink-0"
      onClick={onClick}
      data-testid={`card-business-${business.id}`}
    >
      <CardContent className="p-3">
        {business.imageUrl && (
          <img 
            src={business.imageUrl} 
            alt={business.name}
            className="w-full h-20 object-cover rounded-lg mb-2"
            data-testid={`img-business-${business.id}`}
          />
        )}
        <h4 className="font-medium text-sm" data-testid={`text-business-name-${business.id}`}>
          {business.name}
        </h4>
        <p className="text-xs text-muted-foreground" data-testid={`text-business-category-${business.id}`}>
          {business.category}
        </p>
        {business.rating && business.rating > 0 && (
          <div className="flex items-center gap-1 mt-1">
            <div className="flex text-yellow-400 text-xs">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star 
                  key={i} 
                  className={cn(
                    "w-3 h-3",
                    i < business.rating! ? "fill-current" : ""
                  )}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">
              ({business.rating})
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
