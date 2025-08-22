import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { User, Lock, Mail, Eye, EyeOff, Phone, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { BUSINESS_CATEGORIES } from "@/lib/constants";
import { z } from "zod";

const userRegisterSchema = z.object({
  username: z.string().min(3, "Kullanıcı adı en az 3 karakter olmalıdır"),
  email: z.string().email("Geçerli bir email adresi girin"),
  name: z.string().min(2, "İsim en az 2 karakter olmalıdır"),
  password: z.string().min(6, "Şifre en az 6 karakter olmalıdır"),
  confirmPassword: z.string(),
  location: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Şifreler eşleşmiyor",
  path: ["confirmPassword"],
});

const businessRegisterSchema = z.object({
  name: z.string().min(2, "İşletme adı en az 2 karakter olmalıdır"),
  category: z.string().min(1, "Kategori seçmelisiniz"),
  email: z.string().email("Geçerli bir email adresi girin"),
  password: z.string().min(6, "Şifre en az 6 karakter olmalıdır"),
  confirmPassword: z.string(),
  address: z.string().min(10, "Adres en az 10 karakter olmalıdır"),
  phone: z.string().optional(),
  description: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Şifreler eşleşmiyor",
  path: ["confirmPassword"],
});

type UserRegisterData = z.infer<typeof userRegisterSchema>;
type BusinessRegisterData = z.infer<typeof businessRegisterSchema>;

export default function Register() {
  const [, setLocation] = useLocation();
  const [userType, setUserType] = useState<"user" | "business">("user");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { toast } = useToast();

  const [userFormData, setUserFormData] = useState<UserRegisterData>({
    username: "",
    email: "",
    name: "",
    password: "",
    confirmPassword: "",
    location: "",
  });

  const [businessFormData, setBusinessFormData] = useState<BusinessRegisterData>({
    name: "",
    category: "",
    email: "",
    password: "",
    confirmPassword: "",
    address: "",
    phone: "",
    description: "",
  });

  const registerMutation = useMutation({
    mutationFn: async (data: any) => {
      const endpoint = userType === "business" ? "/api/businesses/register" : "/api/users/register";
      const response = await apiRequest('POST', endpoint, data);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Başarılı",
        description: "Kayıt işlemi tamamlandı! Giriş yapabilirsiniz.",
      });
      setLocation("/login");
    },
    onError: (error: any) => {
      toast({
        title: "Hata",
        description: error.message || "Kayıt işlemi sırasında bir hata oluştu.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (userType === "user") {
        const validatedData = userRegisterSchema.parse(userFormData);
        const { confirmPassword, ...submitData } = validatedData;
        registerMutation.mutate(submitData);
      } else {
        const validatedData = businessRegisterSchema.parse(businessFormData);
        const { confirmPassword, ...submitData } = validatedData;
        registerMutation.mutate(submitData);
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Hata",
          description: error.errors[0].message,
          variant: "destructive",
        });
      }
    }
  };

  const handleUserChange = (field: keyof UserRegisterData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setUserFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleBusinessChange = (field: keyof BusinessRegisterData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setBusinessFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-background to-secondary/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">TarsusGo</h1>
          <p className="text-muted-foreground">Yeni hesap oluşturun</p>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="space-y-4">
            <CardTitle className="text-center">Kayıt Ol</CardTitle>
            
            {/* User Type Selector */}
            <div className="flex gap-2">
              <Button
                type="button"
                variant={userType === "user" ? "default" : "outline"}
                className="flex-1"
                onClick={() => setUserType("user")}
              >
                <User className="w-4 h-4 mr-2" />
                Kullanıcı
              </Button>
              <Button
                type="button"
                variant={userType === "business" ? "default" : "outline"}
                className="flex-1"
                onClick={() => setUserType("business")}
              >
                <Lock className="w-4 h-4 mr-2" />
                İşletme
              </Button>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {userType === "user" ? (
                <>
                  {/* Username */}
                  <div className="space-y-2">
                    <Label htmlFor="username">Kullanıcı Adı</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        id="username"
                        type="text"
                        placeholder="kullanici_adi"
                        value={userFormData.username}
                        onChange={handleUserChange("username")}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  {/* Name */}
                  <div className="space-y-2">
                    <Label htmlFor="name">Ad Soyad</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Ad Soyad"
                      value={userFormData.name}
                      onChange={handleUserChange("name")}
                      required
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email">E-posta</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="ornek@email.com"
                        value={userFormData.email}
                        onChange={handleUserChange("email")}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  {/* Location */}
                  <div className="space-y-2">
                    <Label htmlFor="location">Konum (İsteğe bağlı)</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        id="location"
                        type="text"
                        placeholder="Tarsus, Mersin"
                        value={userFormData.location}
                        onChange={handleUserChange("location")}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Business Name */}
                  <div className="space-y-2">
                    <Label htmlFor="businessName">İşletme Adı</Label>
                    <Input
                      id="businessName"
                      type="text"
                      placeholder="İşletme Adı"
                      value={businessFormData.name}
                      onChange={handleBusinessChange("name")}
                      required
                    />
                  </div>

                  {/* Category */}
                  <div className="space-y-2">
                    <Label htmlFor="category">Kategori</Label>
                    <Select value={businessFormData.category} onValueChange={(value) => setBusinessFormData(prev => ({ ...prev, category: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Kategori seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        {BUSINESS_CATEGORIES.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="businessEmail">E-posta</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        id="businessEmail"
                        type="email"
                        placeholder="isletme@email.com"
                        value={businessFormData.email}
                        onChange={handleBusinessChange("email")}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefon (İsteğe bağlı)</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="0324 123 45 67"
                        value={businessFormData.phone}
                        onChange={handleBusinessChange("phone")}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {/* Address */}
                  <div className="space-y-2">
                    <Label htmlFor="address">Adres</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 text-muted-foreground w-4 h-4" />
                      <Textarea
                        id="address"
                        placeholder="İşletme adresi"
                        value={businessFormData.address}
                        onChange={handleBusinessChange("address")}
                        className="pl-10 min-h-[60px]"
                        required
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label htmlFor="description">Açıklama (İsteğe bağlı)</Label>
                    <Textarea
                      id="description"
                      placeholder="İşletmeniz hakkında kısa bilgi"
                      value={businessFormData.description}
                      onChange={handleBusinessChange("description")}
                      className="min-h-[60px]"
                    />
                  </div>
                </>
              )}

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Şifre</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Şifrenizi girin"
                    value={userType === "user" ? userFormData.password : businessFormData.password}
                    onChange={userType === "user" ? handleUserChange("password") : handleBusinessChange("password")}
                    className="pl-10 pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Şifre Tekrar</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Şifrenizi tekrar girin"
                    value={userType === "user" ? userFormData.confirmPassword : businessFormData.confirmPassword}
                    onChange={userType === "user" ? handleUserChange("confirmPassword") : handleBusinessChange("confirmPassword")}
                    className="pl-10 pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full"
                disabled={registerMutation.isPending}
              >
                {registerMutation.isPending ? "Kayıt oluşturuluyor..." : "Kayıt Ol"}
              </Button>

              {/* Login Link */}
              <div className="text-center pt-4 border-t">
                <p className="text-sm text-muted-foreground mb-2">
                  Zaten hesabınız var mı?
                </p>
                <Link href="/login">
                  <Button variant="outline" className="w-full">
                    Giriş Yap
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link href="/">
            <Button variant="ghost" className="text-muted-foreground">
              Ana Sayfaya Dön
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
