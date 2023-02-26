/**
 * @namespace Settings
 * @description - Class to manage user settings in localStorage so they persist after
 * the application has closed.
 */
class Settings {
  // Check if item exists in settings
  hasItem = (item) => this.getSettings()[item] !== null;

  // Get a specific item in settings (or `undefined`)
  getItem = (item) => this.getSettings()[item];

  // Get all settings and return as a JavaScript object literal
  getSettings = () => {
    const settings = window.localStorage.getItem(this.settingsId)
      ?? this.loadDefaultSettings();

    // Parse settings into JSON object
    const settingsJSON = JSON.parse(settings);

    // Return object literal of settings
    return settingsJSON;
  };

  // Load default settings
  loadDefaultSettings = () => {
    const settings = JSON.stringify({
      isDebugMode: false,
      isExtractSubtitles: false,
      isRemoveAds: false,
      isRememberOutputDir: false,
      isRemoveExistingSubtitles: false,
      isRemoveOld: false,
      isRemoveSubtitles: false,
      isSameAsSource: false,
      language: { key: 'eng', text: 'English' },
      outputDir: null,
      theme: 'dark'
    });

    window.localStorage.setItem(this.settingsId, settings);

    return settings;
  };

  // Delete an item if it exists, otherwise does nothing
  removeItem = (item) => {
    const settings = this.getSettings();
    delete settings[item];

    this.saveSettings(settings);
  };

  // Update settings object with new settings
  saveSettings = (settings) => {
    window.localStorage.setItem(this.settingsId, JSON.stringify(settings));
  };

  // Set item in settings
  setItem = (item, setting) =>
    this.saveSettings({
      ...this.getSettings(),
      [item]: setting
    });

  // ID used for various instances
  settingsId = 'mkvtoolnix-batch-tool-settings';
}

// Export instantiated version of settings
export const settings = new Settings();
