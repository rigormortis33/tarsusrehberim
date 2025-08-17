import { 
  MapPin, 
  Store, 
  Phone, 
  Users, 
  MoreHorizontal,
  Home,
  Bus
} from "lucide-react";

export const NAVIGATION_ITEMS = [
  {
    id: "home",
    label: "Ana Sayfa",
    icon: Home,
    path: "/",
    isActive: true
  },
  {
    id: "transport",
    label: "Ulaşım", 
    icon: Bus,
    path: "/transport"
  },
  {
    id: "business",
    label: "Esnaf",
    icon: Store,
    path: "/business"
  },
  {
    id: "community",
    label: "Topluluk",
    icon: Users,
    path: "/community"
  },
  {
    id: "more",
    label: "Daha",
    icon: MoreHorizontal,
    path: "/more"
  }
];

export const QUICK_ACTIONS = [
  {
    id: "transport",
    title: "Ulaşım",
    subtitle: "Otobüs & Dolmuş",
    icon: Bus,
    color: "primary",
    path: "/transport"
  },
  {
    id: "business",
    title: "Esnaf", 
    subtitle: "İşletme Rehberi",
    icon: Store,
    color: "secondary",
    path: "/business"
  },
  {
    id: "emergency",
    title: "Acil",
    subtitle: "Numaralar",
    icon: Phone,
    color: "destructive",
    path: "/emergency"
  },
  {
    id: "community",
    title: "Topluluk",
    subtitle: "Mahalle Forumu", 
    icon: Users,
    color: "accent",
    path: "/community"
  }
];

export const BUSINESS_CATEGORIES = [
  "Restoran",
  "Kafe", 
  "Market",
  "Eczane",
  "Kuaför",
  "Teknisyen",
  "Doktor",
  "Avukat",
  "Diğer"
];

export const EMERGENCY_CATEGORIES = [
  "Güvenlik",
  "Sağlık", 
  "İtfaiye",
  "Belediye",
  "Diğer"
];
