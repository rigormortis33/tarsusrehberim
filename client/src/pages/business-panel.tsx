import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Edit, Star, Users, Phone, Mail, Globe, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { AppHeader } from "@/components/layout/app-header";
import { BottomNavigation } from "@/components/layout/bottom-navigation";
import { apiRequest } from "@/lib/queryClient";
import { BUSINESS_CATEGORIES } from "@/lib/constants";
import { insertBusinessSchema } from "@shared/schema";
import type { Business } from "@shared/schema";
import { z } from "zod";

const businessFormSchema = insertBusinessSchema.extend({
  email: z.string().email("Geçerli bir email adresi girin").optional().or(z.literal("")),
  website: z.string().url("Geçerli bir website adresi girin").optional().or(z.literal("")),
  openingHours: z.string().optional(),
});

type BusinessFormData = z.infer<typeof businessFormSchema>;

export default function BusinessPanel() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBusiness, setEditingBusiness] = useState<Business | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: businesses, isLoading } = useQuery<Business[]>({
    queryKey: ['/api/businesses/my-businesses'],
  });

  const createMutation = useMutation({
    mutationFn: async (data: BusinessFormData) => {
      const response = await apiRequest('POST', '/api/businesses', data);
    },
  });
  // ...diğer kodlar...
  return (
    <div>
      <AppHeader />
      <h1>İşletme Paneli</h1>
      {/* Buraya panel içeriği eklenebilir */}
      <BottomNavigation />
    </div>
  );
}
