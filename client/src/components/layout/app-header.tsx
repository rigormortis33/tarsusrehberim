import { Search, User, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AppHeaderProps {
  userName?: string;
  location?: string;
}

export function AppHeader({ userName = "Kullanıcı", location = "Tarsus, Mersin" }: AppHeaderProps) {
  return (
    <header className="bg-primary text-white px-4 py-4 shadow-material">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
            <MapPin className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-medium">TarsusGo</h1>
            <p className="text-xs opacity-90">Şehir Rehberi</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon"
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white"
            data-testid="button-search"
          >
            <Search className="w-4 h-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white"
            data-testid="button-profile"
          >
            <User className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
