import SettingsTypes "../types/settings";

module {
  public type SiteSettings = SettingsTypes.SiteSettings;

  public func defaultSettings() : SiteSettings {
    {
      shopName = "Aesthetic Street Wear";
      whatsappNumber = "+1234567890";
      description = "Premium mens streetwear";
      bannerMessage = "New Collection Available";
    };
  };

  public func updateSettings(
    current : SiteSettings,
    updated : SiteSettings,
  ) : SiteSettings {
    {
      current with
      shopName = updated.shopName;
      whatsappNumber = updated.whatsappNumber;
      description = updated.description;
      bannerMessage = updated.bannerMessage;
    };
  };
};
