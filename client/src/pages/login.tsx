import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { User, Lock, Mail, Eye, EyeOff } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Geçerli bir email adresi girin"),
  password: z.string().min(6, "Şifre en az 6 karakter olmalıdır"),
  userType: z.enum(["user", "business"]),
});

type LoginData = z.infer<typeof loginSchema>;

export default function Login() {
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState<LoginData>({
    email: "test@tarsusgo.com", // Pre-filled for testing
    password: "123456", // Pre-filled for testing
    userType: "user",
  });
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();

  const loginMutation = useMutation({
    mutationFn: async (data: LoginData) => {
      console.log("Login attempt with:", data); // Debug log
      const endpoint = data.userType === "business" ? "/api/businesses/login" : "/api/users/login";
      console.log("Using endpoint:", endpoint); // Debug log
      const response = await apiRequest('POST', endpoint, data);
      return response.json();
    },
    onSuccess: (data) => {
      // Token'ı localStorage'a kaydet
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('userType', formData.userType);
      localStorage.setItem('userId', data.user.id);
      
      toast({
        title: "Başarılı",
        description: "Giriş yapıldı!",
      });

      // Kullanıcı tipine göre yönlendir
      if (formData.userType === "business") {
        setLocation("/business-panel");
      } else {
        setLocation("/user-panel");
      }
    },
    onError: (error: any) => {
      console.error("Login error:", error); // Debug log
      toast({
        title: "Hata",
        description: error.message || "Giriş yapılırken bir hata oluştu.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const validatedData = loginSchema.parse(formData);
      loginMutation.mutate(validatedData);
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

  const handleChange = (field: keyof LoginData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
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
          <p className="text-muted-foreground">Hesabınıza giriş yapın</p>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="space-y-4">
            <CardTitle className="text-center">Giriş Yap</CardTitle>
            
            {/* User Type Selector */}
            <div className="flex gap-2">
              <Button
                type="button"
                variant={formData.userType === "user" ? "default" : "outline"}
                className="flex-1"
                onClick={() => setFormData(prev => ({ ...prev, userType: "user" }))}
              >
                <User className="w-4 h-4 mr-2" />
                Kullanıcı
              </Button>
              <Button
                type="button"
                variant={formData.userType === "business" ? "default" : "outline"}
                className="flex-1"
                onClick={() => setFormData(prev => ({ ...prev, userType: "business" }))}
              >
                <Lock className="w-4 h-4 mr-2" />
                İşletme
              </Button>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">E-posta</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="ornek@email.com"
                    value={formData.email}
                    onChange={handleChange("email")}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Şifre</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Şifrenizi girin"
                    value={formData.password}
                    onChange={handleChange("password")}
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

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? "Giriş yapılıyor..." : "Giriş Yap"}
              </Button>

              {/* Forgot Password */}
              <div className="text-center">
                <Link href="/forgot-password">
                  <Button variant="link" className="text-sm">
                    Şifremi Unuttum
                  </Button>
                </Link>
              </div>

              {/* Register Link */}
              <div className="text-center pt-4 border-t">
                <p className="text-sm text-muted-foreground mb-2">
                  Hesabınız yok mu?
                </p>
                <Link href="/register">
                  <Button variant="outline" className="w-full">
                    Kayıt Ol
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
