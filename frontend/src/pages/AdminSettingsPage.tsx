import { Layout } from "@/components/Layout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import api from "@/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import type { SiteSettings } from "@/types";
import {
  Info,
  Megaphone,
  MessageCircle,
  Save,
  Settings,
  Store,
  Loader2,
  ChevronRight,
  ShieldCheck,
  Zap
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { AdminLayout } from "./AdminPage";

function SettingBox({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: any;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-card border border-border/40 rounded-[3rem] p-8 lg:p-10 shadow-sm space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Icon className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-display font-black italic text-xl uppercase tracking-tight">{title}</h3>
          </div>
          <p className="text-xs text-muted-foreground font-medium leading-relaxed max-w-sm">
            {description}
          </p>
        </div>
      </div>
      <div className="space-y-6 pt-2">
        {children}
      </div>
    </div>
  );
}

function AdminSettingsContent() {
  const queryClient = useQueryClient();
  const [localSettings, setLocalSettings] = useState<SiteSettings | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  const { data: serverSettings, isLoading } = useQuery<SiteSettings>({
    queryKey: ["site_settings"],
    queryFn: async () => {
      const { data } = await api.get("/settings");
      return data;
    },
  });

  useEffect(() => {
    if (serverSettings) {
      setLocalSettings(serverSettings);
    }
  }, [serverSettings]);

  const updateMutation = useMutation({
    mutationFn: (newSettings: SiteSettings) => api.put("/settings", newSettings),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["site_settings"] });
      toast.success("Architecture Synchronized", {
        description: "Global store configurations have been successfully updated."
      });
      setIsDirty(false);
    },
    onError: () => toast.error("Configuration Sync Failed"),
  });

  const updateField = (field: keyof SiteSettings, value: string) => {
    if (!localSettings) return;
    setLocalSettings({ ...localSettings, [field]: value });
    setIsDirty(true);
  };

  const handleSave = () => {
    if (localSettings) updateMutation.mutate(localSettings);
  };

  const handleReset = () => {
    if (serverSettings) {
      setLocalSettings(serverSettings);
      setIsDirty(false);
      toast.info("Changes discarded");
    }
  };

  if (isLoading || !localSettings) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <p className="mt-6 text-foreground font-display font-semibold text-lg italic uppercase tracking-widest">Accessing Architecture...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 py-6 max-w-[900px]">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-2">
            <span className="w-8 h-[1.5px] bg-primary"></span>
            System Architecture
          </div>
          <h1 className="font-display text-4xl lg:text-5xl font-black tracking-tighter text-foreground italic uppercase">
            Global Settings <span className="text-primary tracking-normal not-italic lowercase">.</span>
          </h1>
          <p className="text-muted-foreground mt-2 max-w-lg text-sm font-medium leading-relaxed">
            Configure the core parameters of your digital flagship. These settings propagate instantly across the client architecture.
          </p>
        </div>
      </div>

      <div className="space-y-8">
        {/* Shop Identity */}
        <SettingBox
          icon={Store}
          title="Brand Identity"
          description="Your global brand name and public-facing description utilized for SEO and display."
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="shop-name" className="text-[10px] font-black uppercase tracking-widest text-primary">Brand Designation</Label>
              <Input
                id="shop-name"
                value={localSettings.shopName}
                onChange={(e) => updateField("shopName", e.target.value)}
                placeholder="e.g. AESTHETIC STREET WEAR"
                className="h-12 bg-muted/20 border-border/40 rounded-2xl focus-visible:ring-primary/10 text-sm font-bold"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="shop-desc" className="text-[10px] font-black uppercase tracking-widest text-primary">Brand Vision</Label>
              <Input
                id="shop-desc"
                value={localSettings.description}
                onChange={(e) => updateField("description", e.target.value)}
                placeholder="Curating the future of street culture."
                className="h-12 bg-muted/20 border-border/40 rounded-2xl focus-visible:ring-primary/10 text-sm font-medium"
              />
            </div>
          </div>
        </SettingBox>

        {/* WhatsApp */}
        <SettingBox
          icon={MessageCircle}
          title="Hotline Integration"
          description="The primary communication channel for fulfillment and client queries."
        >
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="whatsapp-num" className="text-[10px] font-black uppercase tracking-widest text-primary">WhatsApp Terminal</Label>
              <div className="relative">
                <MessageCircle className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                <Input
                  id="whatsapp-num"
                  value={localSettings.whatsappNumber}
                  onChange={(e) => updateField("whatsappNumber", e.target.value)}
                  placeholder="+91 00000 00000"
                  className="pl-12 h-14 bg-muted/20 border-border/40 rounded-2xl focus-visible:ring-primary/10 text-sm font-black tracking-widest"
                />
              </div>
            </div>
            <div className="flex items-center gap-4 p-5 rounded-3xl bg-primary/5 border border-primary/10">
              <Info className="w-5 h-5 text-primary shrink-0" />
              <p className="text-xs text-muted-foreground leading-relaxed">
                Active Terminal: <span className="font-mono font-bold text-primary">wa.me/{localSettings.whatsappNumber.replace(/\D/g, "")}</span>. Orders will be routed here for final authorization.
              </p>
            </div>
          </div>
        </SettingBox>

        {/* Banner */}
        <SettingBox
          icon={Megaphone}
          title="Announcements"
          description="Manage the high-visibility bulletin bar shown at the system apex."
        >
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="banner-msg" className="text-[10px] font-black uppercase tracking-widest text-primary">Apex Bulletin</Label>
              <Textarea
                id="banner-msg"
                value={localSettings.bannerMessage}
                onChange={(e) => updateField("bannerMessage", e.target.value)}
                placeholder="e.g. 🆕 SEASON 03 DROPPED. FREE SHIPPING ON ALL AUTHORIZED ORDERS."
                rows={3}
                className="bg-muted/20 border-border/40 rounded-[2rem] focus-visible:ring-primary/10 p-5 text-sm font-bold resize-none leading-relaxed"
              />
            </div>

            <div className="space-y-3">
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 text-center">Visual Simulation</p>
              <div
                className="w-full px-6 py-4 rounded-[2rem] bg-foreground text-background text-[10px] font-black uppercase tracking-[0.2em] text-center shadow-inner"
              >
                {localSettings.bannerMessage || "No message currently deployed"}
              </div>
            </div>
          </div>
        </SettingBox>
      </div>

      {/* Floating Action Bar (Conditional) */}
      <AnimatePresence>
        {isDirty && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-md lg:left-[calc(50%+8rem)]"
          >
            <div className="bg-foreground/95 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-4 shadow-2xl flex items-center justify-between gap-4">
              <div className="pl-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-primary">Changes Pending</p>
                <p className="text-[9px] text-white/50 uppercase tracking-widest">Configuration not yet saved</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" onClick={handleReset} className="h-12 rounded-2xl px-6 text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/10">
                  Discard
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={updateMutation.isPending}
                  className="h-12 rounded-2xl px-8 text-[10px] font-black uppercase tracking-widest bg-primary text-primary-foreground hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20"
                >
                  {updateMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Save Architecture
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="pt-10 flex items-center justify-center gap-10 opacity-20 grayscale">
        <ShieldCheck className="w-6 h-6" />
        <Zap className="w-6 h-6" />
        <Store className="w-6 h-6" />
      </div>
    </div>
  );
}

export default function AdminSettingsPage() {
  return (
    <Layout>
      <ProtectedRoute adminOnly>
        <div className="bg-background min-h-[calc(100vh-4rem)]">
          <AdminLayout>
            <AdminSettingsContent />
          </AdminLayout>
        </div>
      </ProtectedRoute>
    </Layout>
  );
}
