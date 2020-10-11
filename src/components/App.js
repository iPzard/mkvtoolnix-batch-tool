import { Component, Fragment } from 'react';

import Home from 'components/home/Home';
import Navigation from 'components/navigation/Navigation';
import React from 'react';
import Settings from 'components/settings/Settings';
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

  // Method to set page and pass props
  pages = (props) => ({
    home: <Home { ...props }/>,
    settings: <Settings { ...props }/>
  });

  render() {

    const {
      pages,
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
          { pages(props)[page] }
        </main>
      </Fragment>
    );
  }
}

export default App;
