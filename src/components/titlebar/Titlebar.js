import { CloseButton, MinimizeButton } from 'components/titlebar/TitlebarButtons';

import React from 'react';
import { app } from 'utils/services';
import favicon from 'components/titlebar/img/favicon.png';
import { initializeIcons } from 'office-ui-fabric-react/lib/Icons';
import styles from 'components/titlebar/scss/Titlebar.module.scss';

initializeIcons();

/**
 * @namespace Titlebar
 * @description Title Component to use as an Electron customized titlebar.
 *
 * @property {id} electron-window-title-text used in main.js to set opacity on/off focus.
 * @property {id} electron-window-title-buttons used in main.js to set opacity on/off focus.
 */

const Titlebar = () => {

  return (
    <section className={ styles.titlebar }>
      <div>
        <img id='electron-window-title-icon' src={ favicon } alt='favicon' />
        <span id='electron-window-title-text'>{ document.title }</span>
      </div>

      <div id='electron-window-title-buttons'>
        <MinimizeButton onClick={ app.minimize }/>
        <CloseButton onClick={ app.quit } />
      </div>
    </section>
  );
};

export default Titlebar;