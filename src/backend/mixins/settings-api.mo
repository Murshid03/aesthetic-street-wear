import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import SettingsTypes "../types/settings";
import SettingsLib "../lib/settings";

mixin (
  accessControlState : AccessControl.AccessControlState,
  settings : { var val : SettingsTypes.SiteSettings },
) {
  public query func getSettings() : async SettingsTypes.SiteSettings {
    settings.val;
  };

  public shared ({ caller }) func updateSettings(updated : SettingsTypes.SiteSettings) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can update settings");
    };
    settings.val := SettingsLib.updateSettings(settings.val, updated);
  };
};
