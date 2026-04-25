import { Layout } from "@/components/Layout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import api from "@/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  ShieldCheck,
  Zap,
  ChevronRight
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
    <div className="bg-white border border-black/5 rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-sm transition-all duration-400 hover:shadow-xl space-y-5 group">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-black text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <Icon className="w-4 h-4" />
            </div>
            <h3 className="text-base font-black uppercase tracking-tight text-black">{title}</h3>
          </div>
          <p className="text-xs font-medium text-black/40 leading-relaxed max-w-sm">
            {description}
          </p>
        </div>
      </div>
      <div className="space-y-4">
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
      toast.success("Settings saved successfully");
      setIsDirty(false);
    },
    onError: () => toast.error("Failed to save settings"),
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
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <div className="w-10 h-10 rounded-full border-4 border-black/5 border-t-primary animate-spin" />
        <p className="text-[9px] font-black uppercase tracking-[0.4em] text-black/20">Loading Settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-5 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-[2px] bg-primary" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Configuration</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
            Site <span className="text-primary italic">Settings</span>
          </h1>
        </div>
      </div>

      <div className="space-y-4 max-w-2xl">
        {/* Brand Identity */}
        <SettingBox
          icon={Store}
          title="Brand Identity"
          description="Update your shop name and description used across the website."
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[9px] font-black uppercase tracking-widest text-black/40">Shop Name</Label>
              <Input
                value={localSettings.shopName}
                onChange={(e) => updateField("shopName", e.target.value)}
                className="h-11 px-4 bg-black/5 rounded-xl border-2 border-transparent focus:border-black transition-all text-sm font-bold outline-none"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[9px] font-black uppercase tracking-widest text-black/40">Shop Description</Label>
              <Input
                value={localSettings.description}
                onChange={(e) => updateField("description", e.target.value)}
                className="h-11 px-4 bg-black/5 rounded-xl border-2 border-transparent focus:border-black transition-all text-sm font-bold outline-none"
              />
            </div>
          </div>
        </SettingBox>

        {/* WhatsApp */}
        <SettingBox
          icon={MessageCircle}
          title="Order Confirmation"
          description="Set the WhatsApp number where customers confirm their orders after checkout."
        >
          <div className="space-y-3">
            <div className="space-y-2">
              <Label className="text-[9px] font-black uppercase tracking-widest text-black/40">WhatsApp Number (10 Digits)</Label>
              <Input
                value={localSettings.whatsappNumber}
                onChange={(e) => updateField("whatsappNumber", e.target.value)}
                placeholder="e.g. 7540096446"
                className="h-11 px-4 bg-black/5 rounded-xl border-2 border-transparent focus:border-black transition-all text-sm font-bold outline-none"
              />
            </div>
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-black/5 border border-black/5">
              <Info className="w-4 h-4 text-primary shrink-0" />
              <p className="text-[9px] font-black uppercase tracking-wider text-black/40 leading-relaxed">
                Active number: <span className="text-primary">{localSettings.whatsappNumber || "Not set"}</span>
              </p>
            </div>
          </div>
        </SettingBox>

        {/* Banner */}
        <SettingBox
          icon={Megaphone}
          title="Top Banner"
          description="Update the announcement message shown at the top of your website."
        >
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-[9px] font-black uppercase tracking-widest text-black/40">Banner Text</Label>
              <Textarea
                value={localSettings.bannerMessage}
                onChange={(e) => updateField("bannerMessage", e.target.value)}
                placeholder="e.g. Free shipping on orders over ₹999!"
                className="min-h-[88px] p-4 bg-black/5 rounded-2xl border-2 border-transparent focus:border-black transition-all text-sm font-bold resize-none"
              />
            </div>
            <div className="space-y-2">
              <p className="text-[8px] font-black uppercase tracking-[0.3em] text-black/20 text-center">Preview</p>
              <div className="w-full px-5 py-3 rounded-full bg-black text-white text-[10px] font-black uppercase tracking-[0.25em] text-center shadow-lg">
                {localSettings.bannerMessage || "No banner message set"}
              </div>
            </div>
          </div>
        </SettingBox>
      </div>

      {/* Floating Save Bar */}
      <AnimatePresence>
        {isDirty && (
          <motion.div
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 80 }}
            className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm px-4"
          >
            <div className="bg-black/95 backdrop-blur-2xl border border-white/10 rounded-2xl p-3 shadow-2xl flex items-center justify-between gap-3">
              <div className="pl-2">
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-primary">Unsaved Changes</p>
                <p className="text-[7px] text-white/30 uppercase tracking-[0.3em]">Save to apply</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" onClick={handleReset} className="h-9 rounded-full px-4 text-[8px] font-black uppercase tracking-widest text-white hover:bg-white/8">
                  Discard
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={updateMutation.isPending}
                  className="h-9 rounded-full px-5 text-[8px] font-black uppercase tracking-widest bg-primary text-white hover:scale-105 transition-all shadow-lg"
                >
                  {updateMutation.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5 mr-1.5" />}
                  Save
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function AdminSettingsPage() {
  return (
    <Layout>
      <ProtectedRoute adminOnly>
        <div className="bg-white min-h-screen">
          <AdminLayout>
            <AdminSettingsContent />
          </AdminLayout>
        </div>
      </ProtectedRoute>
    </Layout>
  );
}
