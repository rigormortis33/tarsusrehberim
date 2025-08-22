import { Search, User, MapPin, LogOut, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLocation } from "wouter";
import { useState, useEffect } from "react";

interface AppHeaderProps {
  userName?: string;
  location?: string;
}

export function AppHeader({ userName = "Kullanıcı", location = "Tarsus, Mersin" }: AppHeaderProps) {
  const [, setLocation] = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUserName, setCurrentUserName] = useState(userName);
  const [userType, setUserType] = useState<string | null>(null);

  useEffect(() => {
    // Check authentication status
    const token = localStorage.getItem('authToken');
    const storedUserType = localStorage.getItem('userType');
    const userId = localStorage.getItem('userId');
    
    if (token && userId) {
      setIsAuthenticated(true);
      setUserType(storedUserType);
      // You might want to fetch user data here
      // For now, we'll use stored user data or props
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const handleProfileClick = () => {
    if (!isAuthenticated) {
      setLocation('/login');
      return;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userType');
    localStorage.removeItem('userId');
    setIsAuthenticated(false);
    setLocation('/');
  };

  const handleProfileSettings = () => {
    if (userType === 'business') {
      setLocation('/business-panel');
    } else {
      setLocation('/user-panel');
    }
  };
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
          
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white"
                  data-testid="button-profile"
                >
                  <User className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">{currentUserName}</p>
                  <p className="text-xs text-muted-foreground">
                    {userType === 'business' ? 'İşletme Hesabı' : 'Kullanıcı Hesabı'}
                  </p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleProfileSettings}>
                  <Settings className="mr-2 h-4 w-4" />
                  {userType === 'business' ? 'İşletme Paneli' : 'Kullanıcı Paneli'}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Çıkış Yap
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button 
              variant="ghost" 
              size="icon"
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white"
              data-testid="button-profile"
              onClick={handleProfileClick}
            >
              <User className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
