import { Fragment } from 'react';
import Home from 'components/home/Home';
import React from 'react';
import Titlebar from 'components/titlebar/Titlebar';
import { customTheme } from 'theme/palette';
import { loadTheme } from 'office-ui-fabric-react';

loadTheme({ palette: customTheme });

function App() {
  return (
    <Fragment>
      <Titlebar />
      <Home />
    </Fragment>
  );
}

export default App;
