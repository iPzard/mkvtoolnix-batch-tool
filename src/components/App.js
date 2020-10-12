import { Component, Fragment } from 'react';

import HomePage from 'components/homepage/HomePage';
import Navigation from 'components/navigation/Navigation';
import React from 'react';
import SettingsPage from 'components/settings/SettingsPage';
import Titlebar from 'components/titlebar/Titlebar';
import { customTheme } from 'theme/palette';
import { loadTheme } from 'office-ui-fabric-react';
import { settings } from 'utils/settings';
import styles from 'components/App.module.scss';

// Load custom theme for Fluent UI
loadTheme({ palette: customTheme });


/**
 * @namespace App
 * @description - Controls global state and page navigation
 */
class App extends Component {

  state = {
    page: 'home',
    input: '',
    output: '',
    settings: {}
  };

  // Initialize settings on load
  componentDidMount() {
    this.setState({ settings: settings.getSettings() });
  };

  // Method to set global app state
  setAppState = (state, callback) => this.setState(state, callback);

  // Method to update settings (including state)
  updateSetting = (item, value, callback) => {
    settings.setItem(item, value);
    this.setState({ settings: settings.getSettings() }, callback);
  };

  render() {

    const {
      setAppState,
      state: {
        input,
        output,
        page,
        settings
      },
      updateSetting
    } = this;

    const props = {
      appState: { input, output },
      setAppState,
      settings,
      updateSetting
    };

    return (
      <Fragment>
        <Titlebar />
        <main className={ styles.main }>
          <Navigation { ...props } />
          <Page { ...props } page={ page }/>
        </main>
      </Fragment>
    );
  }
}

/**
 * @description - Page navigation controller.
 * @property {Component} page - Component to render.
 */
function Page(props) {
  const { page, ...componentProps } = props;

  switch(page) {
    case 'home':
      return <HomePage { ...componentProps }/>;

    case 'settings':
      return <SettingsPage { ...componentProps }/>;
  }
};

export default App;
