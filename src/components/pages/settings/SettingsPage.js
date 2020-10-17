import React, { Component } from 'react';

import { Checkbox } from 'office-ui-fabric-react/lib/Checkbox';
import Footer from 'components/footer/Footer';
import LanguageSettings from 'components/pages/settings/LanguageSettings';
import PropTypes from 'prop-types';
import styles from 'components/pages/settings/assets/styles/SettingsPage.module.scss';

/**
 * @namespace SettingsPage
 * @description - Settings page of the app where settings are updated.
 *
 * @property {object} appState - Global app state.
 * @property {function} setAppState - Function to set global app state.
 * @property {object} settings - User defined, persistent settings.
 * @property {function} updateMultipleSettings - Function to update multiple user defined settings at once.
 * @property {function} updateSetting - Function to update a single setting at a time.
 *
 * @memberof Pages
 */
class SettingsPage extends Component{

  state = {
    isDefaultTrack: false,
    isRemoveAds: false,
    isRemoveExistingSubtitles: false,
    isRemoveOld: false,
    language: { key: 'eng', text: 'English' }
  };

  // Keep component up-to-date w/latest props
  static getDerivedStateFromProps(nextProps) {
    return {
      isDefaultTrack: nextProps.settings.isDefaultTrack,
      isRemoveAds: nextProps.settings.isRemoveAds,
      isRemoveExistingSubtitles: nextProps.settings.isRemoveExistingSubtitles,
      isRemoveOld: nextProps.settings.isRemoveOld,
      language: nextProps.settings.language
    }
  };

  // OnClick method passed to the footer button
  buttonOnClick = () => {

    const defaultSettings = {
      isDefaultTrack: false,
      isRemoveAds: false,
      isRemoveExistingSubtitles: false,
      isRemoveOld: false,
      language: { key: 'eng', text: 'English' }
    };

    // Update settings with defaults for settings page
    this.props.updateMultipleSettings(defaultSettings);
  };

  // Method to toggle "hard-code subtitles" setting
  setHardcodeSetting = () => this.toggleSetting('isDefaultTrack');

  // Method to toggle "subtitle language" setting
  setLanguageSetting = (event, language) => {
    this.props.updateSetting('language', language);
  };

  // Method to toggle "remove subtitle ads" setting
  setRemoveAdsSetting = () => this.toggleSetting('isRemoveAds');

  // Method to toggle "remove old files" setting
  setRemoveFilesSetting = () => this.toggleSetting('isRemoveOld');

  setRemoveExistingSubtitles = () => this.toggleSetting('isRemoveExistingSubtitles');

  // Generic method to toggle a setting
  toggleSetting = (option) => {
    const { props: { settings, updateSetting } } = this;

    updateSetting(option, !settings[option]);
  };


  render() {
    const {
      buttonOnClick,
      setHardcodeSetting,
      setLanguageSetting,
      setRemoveAdsSetting,
      setRemoveExistingSubtitles,
      setRemoveFilesSetting,
      state: {
        isDefaultTrack,
        isRemoveAds,
        isRemoveExistingSubtitles,
        isRemoveOld,
        language
      }
    } = this;

    return (
      <section className={ styles.settings }>
        <LanguageSettings
          language={ language }
          onChange={ setLanguageSetting }
        />

        <Checkbox
          checked={ isRemoveExistingSubtitles }
          className={ styles.checkbox }
          label="Remove existing subtitles from video before merging new ones"
          onChange={ setRemoveExistingSubtitles }
        />

        <Checkbox
          checked={ isRemoveOld }
          className={ styles.checkbox }
          label="Remove old video and subtitle files from source directory when finished"
          onChange={ setRemoveFilesSetting }
        />

        <Checkbox
          checked={ isDefaultTrack }
          className={ styles.checkbox }
          label='Mark subtitles as "default track" so they play automatically'
          onChange={ setHardcodeSetting }
        />

        <Checkbox
          checked={ isRemoveAds }
          className={ styles.checkbox }
          label="Remove known advertisements from subtitles before merging"
          onChange={ setRemoveAdsSetting }
        />

        <Footer
          buttonClassName="reset-button"
          buttonOnClick={ buttonOnClick }
          buttonIcon="SyncOccurence"
          buttonText="Reset"
          buttonTitle="Restore defaults"
          disabled={ false }
        />
      </section>
    )
  }
};


SettingsPage.propTypes = {
  appState: PropTypes.object.isRequired,
  setAppState: PropTypes.func.isRequired,
  settings: PropTypes.object.isRequired,
  updateMultipleSettings: PropTypes.func,
  updateSetting: PropTypes.func
};


export default SettingsPage;