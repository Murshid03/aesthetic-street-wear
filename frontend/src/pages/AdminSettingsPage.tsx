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
    <div className="bg-white border border-black/5 rounded-[3rem] p-10 shadow-sm transition-all duration-500 hover:shadow-2xl space-y-10 group">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center shadow-xl group-hover:scale-105 transition-transform">
              <Icon className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-black uppercase tracking-tight text-black">{title}</h3>
          </div>
          <p className="text-sm font-medium text-black/40 leading-relaxed max-w-sm">
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
      toast.success("Protocol Synchronized");
      setIsDirty(false);
    },
    onError: () => toast.error("Sync Protocol Failure"),
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
      toast.info("Changes Discarded");
    }
  };

  if (isLoading || !localSettings) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-6">
        <div className="w-12 h-12 rounded-full border-4 border-black/5 border-t-primary animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-black/20">Syncing Architecture...</p>
      </div>
    );
  }

  return (
    <div className="space-y-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-[2px] bg-primary" />
            <span className="text-[11px] font-black uppercase tracking-[0.5em] text-primary">Systems . Control</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter" style={{ fontFamily: "var(--font-display)" }}>GLOBAL <br /> <span className="text-primary italic text-4xl md:text-6xl">PROTOCOLS</span></h1>
        </div>
      </div>

      <div className="space-y-10 max-w-3xl">
        {/* Shop Identity */}
        <SettingBox
          icon={Store}
          title="BRAND SIGNATURE"
          description="Global manifestation parameters and metadata used for collection identification."
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <Label className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-1">Archive Designation</Label>
              <Input
                value={localSettings.shopName}
                onChange={(e) => updateField("shopName", e.target.value)}
                className="h-14 px-6 bg-black/5 rounded-2xl border-2 border-transparent focus:border-black transition-all text-xs font-bold outline-none"
              />
            </div>
            <div className="space-y-3">
              <Label className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-1">Vision Statement</Label>
              <Input
                value={localSettings.description}
                onChange={(e) => updateField("description", e.target.value)}
                className="h-14 px-6 bg-black/5 rounded-2xl border-2 border-transparent focus:border-black transition-all text-xs font-bold outline-none"
              />
            </div>
          </div>
        </SettingBox>

        {/* WhatsApp */}
        <SettingBox
          icon={MessageCircle}
          title="COMMUNICATION HUB"
          description="Primary encrypted channel for manifest validation and logistics support."
        >
          <div className="space-y-6">
            <div className="space-y-3">
              <Label className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-1">Terminal ID (WhatsApp)</Label>
              <Input
                value={localSettings.whatsappNumber}
                onChange={(e) => updateField("whatsappNumber", e.target.value)}
                className="h-14 px-6 bg-black/5 rounded-2xl border-2 border-transparent focus:border-black transition-all text-xs font-bold outline-none"
              />
            </div>
            <div className="flex items-center gap-4 p-8 rounded-[2rem] bg-black/5 border border-black/5">
              <Info className="w-5 h-5 text-primary shrink-0" />
              <p className="text-[10px] font-black uppercase tracking-widest text-black/40 leading-relaxed italic">
                Active Uplink: <span className="text-primary">ARCHIVE . 0x{localSettings.whatsappNumber.replace(/\D/g, "")}</span>
              </p>
            </div>
          </div>
        </SettingBox>

        {/* Banner */}
        <SettingBox
          icon={Megaphone}
          title="APEX ANNOUNCEMENTS"
          description="High-visibility bulletin deployed across all terminal apex sectors."
        >
          <div className="space-y-8">
            <div className="space-y-3">
              <Label className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-1">Bulletin Script</Label>
              <Textarea
                value={localSettings.bannerMessage}
                onChange={(e) => updateField("bannerMessage", e.target.value)}
                className="min-h-[120px] p-6 bg-black/5 rounded-[2rem] border-2 border-transparent focus:border-black transition-all text-sm font-bold resize-none"
              />
            </div>

            <div className="space-y-4">
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-black/20 text-center">Visual Simulation</p>
              <div className="w-full px-8 py-4 rounded-full bg-black text-white text-[10px] font-black uppercase tracking-[0.3em] text-center shadow-2xl">
                {localSettings.bannerMessage || "PROTOCOL SILENT"}
              </div>
            </div>
          </div>
        </SettingBox>
      </div>

      {/* Floating Save */}
      <AnimatePresence>
        {isDirty && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed bottom-12 left-1/2 -translate-x-1/2 z-50 w-full max-w-lg px-6"
          >
            <div className="bg-black/95 backdrop-blur-2xl border border-white/10 rounded-full p-4 shadow-2xl flex items-center justify-between gap-6">
              <div className="pl-6">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">MANIFEST MODIFIED</p>
                <p className="text-[8px] text-white/30 uppercase tracking-[0.3em]">Signature pending synchronization</p>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="ghost" onClick={handleReset} className="h-12 rounded-full px-8 text-[9px] font-black uppercase tracking-widest text-white hover:bg-white/5">
                  Discard
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={updateMutation.isPending}
                  className="h-12 rounded-full px-10 text-[9px] font-black uppercase tracking-widest bg-primary text-white hover:scale-105 transition-all shadow-xl"
                >
                  {updateMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                  SYNC ARCHITECTURE
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
