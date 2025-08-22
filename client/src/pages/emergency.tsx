import { useQuery } from "@tanstack/react-query";
import { Phone, Shield, Heart, Flame, Building, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AppHeader } from "@/components/layout/app-header";
import { BottomNavigation } from "@/components/layout/bottom-navigation";
import type { EmergencyContact } from "@shared/schema";

export default function Emergency() {
  const { data: emergencyContacts, isLoading } = useQuery<EmergencyContact[]>({
    queryKey: ['/api/emergency-contacts'],
  });

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'güvenlik':
        return Shield;
      case 'sağlık':
        return Heart;
      case 'itfaiye':
        return Flame;
      case 'belediye':
        return Building;
      default:
        return Phone;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'güvenlik':
        return 'text-blue-600 bg-blue-100';
      case 'sağlık':
        return 'text-red-600 bg-red-100';
      case 'itfaiye':
        return 'text-orange-600 bg-orange-100';
      case 'belediye':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const handleCall = (phone: string) => {
    window.open(`tel:${phone}`, '_self');
  };

  const groupedContacts = emergencyContacts?.reduce((acc, contact) => {
    const category = contact.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(contact);
    return acc;
  }, {} as Record<string, EmergencyContact[]>) || {};

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
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-medium">Acil Durumlar</h2>
              <p className="text-sm opacity-90">112 - Tek Numara, Tüm Acil Durumlar</p>
            </div>
          </div>
        </section>

        {/* Quick Emergency Numbers */}
        <section className="p-4">
          <h3 className="text-lg font-medium mb-4 text-foreground">Acil Çağrı Sistemi</h3>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 text-white" />
              </div>
              <div>
                <h4 className="font-medium text-blue-900 mb-2">ÖNEMLİ BİLGİ</h4>
                <p className="text-sm text-blue-800">
                  Türkiye'de <strong>2020 yılından</strong> itibaren tüm acil durumlar için 
                  <strong className="bg-red-600 text-white px-2 py-1 rounded mx-1">112</strong> 
                  numarası kullanılmaktadır.
                </p>
                <p className="text-xs text-blue-700 mt-2">
                  112'yi aradığınızda size en yakın ambulans, itfaiye veya polis ekibi yönlendirilir.
                </p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-3 mb-6">
            {/* Ana Acil Numara */}
            <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-lg p-4 text-white">
              <div className="text-center">
                <Heart className="w-8 h-8 mx-auto mb-2" />
                <h4 className="text-lg font-bold mb-1">ACİL DURUM</h4>
                <div className="text-3xl font-bold mb-2">112</div>
                <p className="text-sm opacity-90">Tüm acil durumlar için TEK NUMARA</p>
                <p className="text-xs opacity-75 mt-1">Ambulans • İtfaiye • Polis • Jandarma</p>
                <Button
                  onClick={() => handleCall("112")}
                  className="mt-3 bg-white text-red-600 hover:bg-gray-100 font-bold"
                  size="lg"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  112'yi ARA
                </Button>
              </div>
            </div>

            {/* Diğer Özel Numaralar */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { name: "Sahil Güvenlik", number: "158", color: "bg-blue-600", icon: Shield },
                { name: "Orman Yangını", number: "177", color: "bg-green-600", icon: Flame },
                { name: "AFAD", number: "122", color: "bg-orange-600", icon: AlertTriangle }
              ].map((emergency) => {
                const Icon = emergency.icon;
                return (
                  <Button
                    key={emergency.number}
                    onClick={() => handleCall(emergency.number)}
                    className={`h-20 flex flex-col items-center gap-1 text-white ${emergency.color} hover:opacity-90`}
                    data-testid={`button-emergency-${emergency.number}`}
                  >
                    <Icon className="w-4 h-4" />
                    <div className="text-center">
                      <div className="font-medium text-xs">{emergency.name}</div>
                      <div className="text-xs">{emergency.number}</div>
                    </div>
                  </Button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Local Emergency Contacts */}
        <section className="p-4">
          <h3 className="text-lg font-medium mb-4 text-foreground">Yerel Acil Numaralar</h3>
          
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="shadow-material">
                  <CardContent className="p-4">
                    <div className="animate-pulse">
                      <div className="h-4 bg-muted rounded w-2/3 mb-2"></div>
                      <div className="h-3 bg-muted rounded w-1/2 mb-2"></div>
                      <div className="h-3 bg-muted rounded w-3/4"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : Object.keys(groupedContacts).length > 0 ? (
            <div className="space-y-6">
              {Object.entries(groupedContacts).map(([category, contacts]) => {
                const Icon = getCategoryIcon(category);
                const colorClasses = getCategoryColor(category);
                
                return (
                  <div key={category}>
                    <div className="flex items-center gap-2 mb-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${colorClasses}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <h4 className="font-medium text-foreground">{category}</h4>
                    </div>
                    
                    <div className="space-y-3">
                      {contacts.map((contact) => (
                        <Card key={contact.id} className="shadow-material">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <h5 className="font-medium text-sm" data-testid={`text-contact-name-${contact.id}`}>
                                  {contact.name}
                                </h5>
                                {contact.description && (
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {contact.description}
                                  </p>
                                )}
                                <div className="flex items-center gap-2 mt-2">
                                  <span className="text-sm font-mono">{contact.phone}</span>
                                  {contact.isAvailable247 && (
                                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                      7/24
                                    </span>
                                  )}
                                </div>
                              </div>
                              <Button 
                                onClick={() => handleCall(contact.phone)}
                                className="ml-4"
                                data-testid={`button-call-${contact.id}`}
                              >
                                <Phone className="w-4 h-4 mr-2" />
                                Ara
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <Card className="shadow-material">
              <CardContent className="p-8 text-center">
                <Phone className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h4 className="font-medium mb-2">Acil numara bulunamadı</h4>
                <p className="text-sm text-muted-foreground">
                  Yerel acil numaralar henüz eklenmemiş.
                </p>
              </CardContent>
            </Card>
          )}
        </section>

        {/* Emergency Tips */}
        <section className="p-4">
          <Card className="shadow-material bg-yellow-50 border-yellow-200">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2 text-yellow-800">
                <AlertTriangle className="w-4 h-4" />
                Acil Durum İpuçları
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <ul className="text-xs text-yellow-800 space-y-1">
                <li>• <strong>112</strong>'yi arayın - Tüm acil durumlar için tek numara</li>
                <li>• Konumunuzu net belirtin: "Tarsus, [sokak/mahalle adı]"</li>
                <li>• Durumu kısaca ve açık bir şekilde anlatın</li>
                <li>• Telefonu kapatmayın, operatörün sorularını yanıtlayın</li>
                <li>• Yaralıları hareket ettirmeyin, güvenli bir yerde bekleyin</li>
              </ul>
            </CardContent>
          </Card>
        </section>
      </main>

      <BottomNavigation />
    </div>
  );
}
