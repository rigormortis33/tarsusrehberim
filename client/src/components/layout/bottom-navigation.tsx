import { Link, useLocation } from "wouter";
import { NAVIGATION_ITEMS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function BottomNavigation() {
  const [location] = useLocation();

  return (
    <nav className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-card border-t border-border px-4 py-2">
      <div className="flex items-center justify-around">
        {NAVIGATION_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.path;
          
          return (
            <Link key={item.id} href={item.path}>
              <button 
                className={cn(
                  "flex flex-col items-center py-2 px-3 rounded-lg transition-colors duration-200",
                  isActive 
                    ? "text-primary bg-primary/10" 
                    : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                )}
                data-testid={`nav-${item.id}`}
              >
                <Icon className="w-5 h-5 mb-1" />
                <span className={cn(
                  "text-xs",
                  isActive ? "font-medium" : ""
                )}>
                  {item.label}
                </span>
              </button>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
