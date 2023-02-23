import React, { Component } from 'react';
import { Checkbox } from 'office-ui-fabric-react/lib/Checkbox';
import LanguageSettings from 'components/pages/settings/LanguageSettings';
import PropTypes from 'prop-types';
import styles from 'components/pages/settings/assets/styles/SettingsPage.module.scss';
import { app } from 'utils/services';

/**
 * @namespace SettingsPage
 * @description - Settings page of the app where settings are updated.
 *
 * @property {object} appState - Global app state.
 * @property {function} setAppState - Function to set global app state (unused).
 * @property {object} settings - User defined, persistent settings.
 * @property {function} updateMultipleSettings - Function to update multiple user defined settings at once.
 * @property {function} updateSetting - Function to update a single setting at a time.
 *
 * @memberof Pages
 */
class SettingsPage extends Component {
  state = {
    isDebugMode: true,
    isRememberOutputDir: false,
    isRemoveAds: false,
    isRemoveExistingSubtitles: false,
    isRemoveOld: false,
    language: { key: 'unset', text: 'None' }
  };

  // Keep component up-to-date w/latest props
  static getDerivedStateFromProps(nextProps) {
    return {
      isDebugMode: nextProps.settings.isDebugMode,
      isRememberOutputDir: nextProps.settings.isRememberOutputDir,
      isRemoveAds: nextProps.settings.isRemoveAds,
      isRemoveExistingSubtitles: nextProps.settings.isRemoveExistingSubtitles,
      isRemoveOld: nextProps.settings.isRemoveOld,
      language: nextProps.settings.language
    };
  }

  // Method to toggle "subtitle language" setting
  setLanguageSetting = (event, language) => {
    this.props.updateSetting('language', language);
  };

  // Generic method to toggle or update a setting
  toggleSetting = (option) => {
    this.props.updateSetting(option, !this.props.settings[option]);
  };

  // Method to update the remember output directory and related settings
  updateRememberOutputDir = () => {
    const { isRememberOutputDir, isSameAsSource } = this.props.settings;
    const outputIfNotSameAsSource = !isSameAsSource && this.props.appState.output;

    if (isRememberOutputDir) {
      this.props.updateMultipleSettings({
        isRememberOutputDir: false,
        outputDir: null
      });
    } else {
      this.props.updateMultipleSettings({
        isRememberOutputDir: true,
        outputDir: outputIfNotSameAsSource || null
      });
    }
  };

  toggleDetached = () => {
    this.toggleSetting('isDebugMode');

    /**
     * Spamming checkbox would otherwise cause
     * issues w/async calls from socket.io
     */
    const debounceOption = (fn) => {
      const timeoutId = 'enable-dev-console-timeout';
      let timeout = this.props.settings[timeoutId];

      return () => {
        if (timeout) {
          clearTimeout(Number(timeout));
          this.props.updateSetting(timeoutId, 0);
        }
        timeout = setTimeout(fn, app.reconnectionDelay);
        this.props.updateSetting(timeoutId, timeout);
      };
    };

    // Debounced function to restart app
    const debouncedRestart = debounceOption(() => {
      const { isDebugMode } = this.state;

      app.restart({
        detached: isDebugMode,
        shell: true,
        stdio: isDebugMode ? 'inherit' : 'pipe'
      });
    });

    // Invoke debounced restart
    debouncedRestart();
  };

  render() {
    const {
      setLanguageSetting,
      state: {
        isRememberOutputDir,
        isRemoveAds,
        isRemoveExistingSubtitles,
        isRemoveOld,
        language,
        isDebugMode
      },
      toggleDetached,
      toggleSetting,
      updateRememberOutputDir
    } = this;

    return (
      <section className={ styles.settings }>
        <LanguageSettings
          language={ language }
          setLanguageSetting={ setLanguageSetting }
        />
        <Checkbox
          checked={ isRemoveExistingSubtitles }
          className={ styles.checkbox }
          label="Remove existing subtitles from video before merging new ones"
          onChange={ () => toggleSetting('isRemoveExistingSubtitles') }
        />

        <Checkbox
          checked={ isRemoveOld }
          className={ styles.checkbox }
          label="Remove original files when merging or removing subtitles"
          onChange={ () => toggleSetting('isRemoveOld') }
        />

        <Checkbox
          checked={ isRemoveAds }
          className={ styles.checkbox }
          label="Remove known advertisements from subtitles before merging"
          onChange={ () => toggleSetting('isRemoveAds') }
        />

        <Checkbox
          checked={ isRememberOutputDir }
          className={ styles.checkbox }
          label="Remember output directory if not same as source"
          onChange={ updateRememberOutputDir }
        />

        <Checkbox
          checked={ isDebugMode }
          className={ styles.checkbox }
          label="Enable debug mode and show developer console data"
          onChange={ toggleDetached }
        />
      </section>
    );
  }
}


SettingsPage.defaultProps = {
  updateMultipleSettings: undefined,
  updateSetting: undefined
};

SettingsPage.propTypes = {
  appState: PropTypes.object.isRequired,
  settings: PropTypes.shape({
    isSameAsSource: PropTypes.bool.isRequired,
    isDebugMode: PropTypes.bool.isRequired,
    isRememberOutputDir: PropTypes.bool.isRequired,
    isRemoveAds: PropTypes.bool.isRequired,
    isRemoveExistingSubtitles: PropTypes.bool.isRequired,
    isRemoveOld: PropTypes.bool.isRequired,
    language: PropTypes.shape({
      key: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired
    }).isRequired
  }).isRequired,
  updateMultipleSettings: PropTypes.func,
  updateSetting: PropTypes.func
};

export default SettingsPage;
