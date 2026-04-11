import { Layout } from "@/components/Layout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
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
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { AdminLayout } from "./AdminPage";

const DEFAULT_SETTINGS: SiteSettings = {
  shopName: "Aesthetic Street Wear",
  whatsappNumber: "+1234567890",
  description:
    "Premium mens streetwear — modern silhouettes, curated essentials.",
  bannerMessage:
    "🆕 New Collection 2026 is here! Free shipping on orders over $200.",
};

function SettingSection({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: typeof Settings;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8">
      <div className="lg:col-span-1">
        <div className="flex items-center gap-2.5 mb-1">
          <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
            <Icon className="w-3.5 h-3.5 text-primary" />
          </div>
          <h3 className="font-semibold text-sm">{title}</h3>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed pl-9">
          {description}
        </p>
      </div>
      <div className="lg:col-span-2 space-y-4">{children}</div>
    </div>
  );
}

function AdminSettingsContent() {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [saved, setSaved] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [isDirty, setIsDirty] = useState(false);

  const update = (field: keyof SiteSettings, value: string) => {
    setSettings((s) => ({ ...s, [field]: value }));
    setIsDirty(true);
  };

  const handleSave = () => {
    setSaved(settings);
    setIsDirty(false);
    toast.success("Settings saved successfully");
  };

  const handleReset = () => {
    setSettings(saved);
    setIsDirty(false);
    toast.info("Changes discarded");
  };

  return (
    <div className="flex-1 min-w-0">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Settings className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-label text-primary mb-0">Admin</p>
            <h1 className="font-display text-3xl font-bold">Settings</h1>
          </div>
        </div>
        {isDirty && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <Button variant="outline" size="sm" onClick={handleReset}>
              Discard
            </Button>
            <Button
              className="btn-primary"
              size="sm"
              onClick={handleSave}
              data-ocid="save-settings-btn"
            >
              <Save className="w-3.5 h-3.5 mr-1.5" />
              Save Changes
            </Button>
          </motion.div>
        )}
      </div>

      <div className="card-elevated p-5 lg:p-8 space-y-8">
        {/* Shop Identity */}
        <SettingSection
          icon={Store}
          title="Shop Identity"
          description="Your store's name and public-facing description shown across the site."
        >
          <div className="space-y-1.5">
            <Label htmlFor="shop-name">Shop Name</Label>
            <Input
              id="shop-name"
              value={settings.shopName}
              onChange={(e) => update("shopName", e.target.value)}
              placeholder="Aesthetic Street Wear"
              data-ocid="shop-name-input"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="shop-desc">Description</Label>
            <Textarea
              id="shop-desc"
              value={settings.description}
              onChange={(e) => update("description", e.target.value)}
              placeholder="Tell customers what makes your store unique…"
              rows={2}
              data-ocid="shop-desc-input"
            />
          </div>
        </SettingSection>

        <Separator />

        {/* WhatsApp */}
        <SettingSection
          icon={MessageCircle}
          title="WhatsApp Integration"
          description="The WhatsApp number customers use to place orders. Include country code."
        >
          <div className="space-y-1.5">
            <Label htmlFor="whatsapp-num">WhatsApp Number</Label>
            <div className="relative">
              <MessageCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="whatsapp-num"
                value={settings.whatsappNumber}
                onChange={(e) => update("whatsappNumber", e.target.value)}
                placeholder="+1234567890"
                className="pl-9"
                data-ocid="whatsapp-num-input"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Format: +[country code][number] — e.g. +14155552671
            </p>
          </div>
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-muted/50 border border-border">
            <Info className="w-4 h-4 text-muted-foreground shrink-0" />
            <p className="text-xs text-muted-foreground">
              Orders will generate a pre-filled WhatsApp link using{" "}
              <span className="font-mono">
                wa.me/{settings.whatsappNumber.replace(/\D/g, "")}
              </span>
            </p>
          </div>
        </SettingSection>

        <Separator />

        {/* Banner */}
        <SettingSection
          icon={Megaphone}
          title="Banner Message"
          description="A promotional message shown in the site header or as an announcement bar."
        >
          <div className="space-y-1.5">
            <Label htmlFor="banner-msg">Banner Text</Label>
            <Textarea
              id="banner-msg"
              value={settings.bannerMessage}
              onChange={(e) => update("bannerMessage", e.target.value)}
              placeholder="e.g. 🆕 New arrivals just dropped! Free shipping over $200."
              rows={2}
              data-ocid="banner-msg-input"
            />
          </div>

          {/* Preview */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              Live Preview
            </p>
            <div
              className="w-full px-4 py-2.5 rounded-lg bg-primary/10 border border-primary/20 text-sm text-primary font-medium text-center"
              data-ocid="banner-preview"
            >
              {settings.bannerMessage || (
                <span className="italic opacity-50">No banner message set</span>
              )}
            </div>
          </div>
        </SettingSection>
      </div>

      {/* Save bar at bottom */}
      <div className="mt-6 flex justify-end gap-3">
        {isDirty && (
          <Button variant="outline" onClick={handleReset}>
            Discard Changes
          </Button>
        )}
        <Button
          className="btn-primary"
          onClick={handleSave}
          disabled={!isDirty}
          data-ocid="save-settings-bottom-btn"
        >
          <Save className="w-4 h-4 mr-2" />
          Save Settings
        </Button>
      </div>
    </div>
  );
}

export default function AdminSettingsPage() {
  return (
    <Layout>
      <ProtectedRoute>
        <div className="bg-muted/30 min-h-[calc(100vh-4rem)]">
          <AdminLayout>
            <AdminSettingsContent />
          </AdminLayout>
        </div>
      </ProtectedRoute>
    </Layout>
  );
}
