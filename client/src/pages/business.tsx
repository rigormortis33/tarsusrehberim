import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Store, Filter } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AppHeader } from "@/components/layout/app-header";
import { BottomNavigation } from "@/components/layout/bottom-navigation";
import { BusinessCard } from "@/components/business/business-card";
import { BUSINESS_CATEGORIES } from "@/lib/constants";
import type { Business } from "@shared/schema";

export default function BusinessPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const { data: businesses, isLoading } = useQuery<Business[]>({
    queryKey: selectedCategory && selectedCategory !== "all" ? ['/api/businesses', { category: selectedCategory }] : ['/api/businesses'],
  });

  const filteredBusinesses = businesses?.filter((business) =>
    business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    business.description?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

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
        <section className="p-4 bg-gradient-to-r from-secondary to-orange-600 text-white">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-medium">Esnaf Rehberi</h2>
              <p className="text-sm opacity-90">Yerel İşletmeleri Keşfedin</p>
            </div>
          </div>
        </section>

        {/* Search and Filter */}
        <section className="p-4 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="İşletme ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              data-testid="input-search-business"
            />
          </div>
          
          <div className="flex gap-2">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="flex-1" data-testid="select-category">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  <SelectValue placeholder="Kategori seçin" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tüm Kategoriler</SelectItem>
                {BUSINESS_CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {selectedCategory && selectedCategory !== "all" && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setSelectedCategory("")}
                data-testid="button-clear-filter"
              >
                Temizle
              </Button>
            )}
          </div>
        </section>

        {/* Featured Businesses */}
        {!searchTerm && (!selectedCategory || selectedCategory === "all") && (
          <section className="p-4">
            <h3 className="text-lg font-medium mb-4 text-foreground">Öne Çıkan İşletmeler</h3>
            
            <div className="flex gap-3 overflow-x-auto pb-2">
              {businesses?.filter(b => b.isPremium).map((business) => (
                <BusinessCard key={business.id} business={business} />
              ))}
            </div>
          </section>
        )}

        {/* Business List */}
        <section className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-foreground">
              {selectedCategory ? `${selectedCategory} İşletmeleri` : 'Tüm İşletmeler'}
            </h3>
            <span className="text-sm text-muted-foreground">
              {filteredBusinesses.length} sonuç
            </span>
          </div>
          
          {isLoading ? (
            <div className="grid gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Card key={i} className="shadow-material">
                  <CardContent className="p-4">
                    <div className="animate-pulse">
                      <div className="h-4 bg-muted rounded w-2/3 mb-2"></div>
                      <div className="h-3 bg-muted rounded w-1/2 mb-2"></div>
                      <div className="h-3 bg-muted rounded w-full mb-1"></div>
                      <div className="h-3 bg-muted rounded w-3/4"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredBusinesses.length > 0 ? (
            <div className="grid gap-4">
              {filteredBusinesses.map((business) => (
                <Card key={business.id} className="shadow-material hover:shadow-material-lg transition-all duration-200">
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      {business.imageUrl && (
                        <img 
                          src={business.imageUrl} 
                          alt={business.name}
                          className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-1">
                          <h4 className="font-medium text-sm" data-testid={`text-business-name-${business.id}`}>
                            {business.name}
                          </h4>
                          {business.isPremium && (
                            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                              Premium
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-primary mb-1">{business.category}</p>
                        {business.description && (
                          <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                            {business.description}
                          </p>
                        )}
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-muted-foreground">{business.address}</p>
                          {business.phone && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="h-6 px-2 text-xs"
                              data-testid={`button-call-${business.id}`}
                            >
                              Ara
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="shadow-material">
              <CardContent className="p-8 text-center">
                <Store className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h4 className="font-medium mb-2">İşletme bulunamadı</h4>
                <p className="text-sm text-muted-foreground">
                  {searchTerm || selectedCategory ? 
                    "Arama kriterlerinize uygun işletme bulunamadı." :
                    "Henüz kayıtlı işletme bulunmuyor."
                  }
                </p>
              </CardContent>
            </Card>
          )}
        </section>
      </main>

      <BottomNavigation />
    </div>
  );
}
