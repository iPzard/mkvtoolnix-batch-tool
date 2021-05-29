import { Component, Fragment } from 'react';
import { darkTheme, lightTheme, togglePalette } from 'theme/palettes';

import MainPage from 'components/pages/main/MainPage';
import Navigation from 'components/navigation/Navigation';
import React from 'react';
import SettingsPage from 'components/pages/settings/SettingsPage';
import Titlebar from 'components/titlebar/Titlebar';
import { loadTheme } from 'office-ui-fabric-react';
import { settings } from 'utils/settings';
import styles from 'components/App.module.scss';

/**
 * @namespace App
 * @description - Controls global state and page navigation
 */
class App extends Component {
  state = {
    input: '',
    output: '',
    page: 'main',
    settings: {}
  };

  // Initialize settings on load
  componentDidMount() {
    loadTheme({ palette: darkTheme }); // default theme
    this.setState({
      output: settings.getItem('outputDir') || '',
      settings: settings.getSettings()
    });
  }

  componentDidUpdate(_prevProps, prevState) {
    const {
      state: {
        settings: { theme }
      }
    } = this;
    const {
      settings: { theme: prevTheme }
    } = prevState;

    if (theme !== prevTheme) {
      togglePalette(theme);

      if (theme === 'light') loadTheme({ palette: lightTheme });
      else loadTheme({ palette: darkTheme });
    }
  }

  // Method to set global app state
  setAppState = (state, callback) => this.setState(state, callback);

  // Method to update settings (including state)
  updateSetting = (item, value, callback) => {
    settings.setItem(item, value);
    this.setState({ settings: settings.getSettings() }, callback);
  };

  // Method to update multiple settings (including state)
  updateMultipleSettings = (newSettings, callback) => {
    const currentSettings = settings.getSettings();
    const updatedSettings = { ...currentSettings, ...newSettings };

    settings.saveSettings(updatedSettings);
    this.setState({ settings: updatedSettings }, callback);
  };

  render() {
    const {
      setAppState,
      state: { input, output, page, settings, theme },
      updateMultipleSettings,
      updateSetting
    } = this;

    const componentProps = {
      appState: { input, output, theme },
      setAppState,
      settings,
      updateMultipleSettings,
      updateSetting
    };

    return (
      <Fragment>
        <Titlebar />
        <main className={styles.main}>
          <Navigation {...componentProps} />
          <PageController {...componentProps} page={page} />
        </main>
      </Fragment>
    );
  }
}

/**
 * @description - Page navigation controller.
 * @property {Component} page - Component to render.
 */
function PageController(props) {
  const { page, ...componentProps } = props;

  switch (page) {
    case 'settings':
      return <SettingsPage {...componentProps} />;

    case 'main':
    default:
      return <MainPage {...componentProps} />;
  }
}

export default App;
