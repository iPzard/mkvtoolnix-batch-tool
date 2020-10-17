/**
 * @namespace Settings
 * @description - Class to manage user settings in localStorage so they persist after
 * the application has closed.
 */
class Settings{

  // Check if item exists in settings
  hasItem = (item) => this.getSettings()[item] !== null;


  // Set item in settings
  setItem = (item, setting) => this.saveSettings({
    ...this.getSettings(), [item]: setting
  });


  // Get a specific item in settings (or `undefined`)
  getItem = (item) => this.getSettings()[item];


  // Delete an item if it exists, otherwise does nothing
  removeItem = (item) => {
    const settings = this.getSettings();
    delete settings[item];

    this.saveSettings(settings);
  };


  // Get all settings and return as a JavaScript object literal
  getSettings = () => {

    // If settings don't exist, set to defaults
    if(window.localStorage.getItem('settings') === null)
      this.loadDefaultSettings();

    // Return object literal of settings
    return JSON.parse(window.localStorage.getItem('settings'));
  };


  // Load default settings
  loadDefaultSettings = () => {
    const settings = JSON.stringify({
      isDefaultTrack: false,
      isRemoveAds: false,
      isRemoveExistingSubtitles: false,
      isRemoveOld: false,
      isRemoveSubtitles: false,
      isSameAsSource: false,
      language: { key: 'eng', text: 'English' },
      theme: 'dark'
    });

    window.localStorage.setItem('settings', settings);
  };

  // Update settings object with new settings
  saveSettings = (settings) => {
    window.localStorage.setItem('settings', JSON.stringify(settings));
  };
};


// Export instantiated version of settings
export const settings = new Settings();