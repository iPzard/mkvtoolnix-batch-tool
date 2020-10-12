import { Component, Fragment } from 'react';

import HomePage from 'components/homepage/HomePage';
import Navigation from 'components/navigation/Navigation';
import React from 'react';
import SettingsPage from 'components/settings/SettingsPage';
import Titlebar from 'components/titlebar/Titlebar';
import { customTheme } from 'theme/palette';
import { loadTheme } from 'office-ui-fabric-react';
import { settings } from 'utils/services';
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
    isSameAsSource: false,
    output: '',
  }

  componentDidMount() {
    this.setState({ isSameAsSource: settings.getItem('isSameAsSource') });
  };

  // Method to set global app state
  setAppState = (state, callback) => this.setState(state, callback);


  render() {

    const {
      setAppState,
      state,
      state: { page }
    } = this;

    const props = {
      appState: state,
      setAppState,
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
