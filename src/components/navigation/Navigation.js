import React, { useState } from 'react';

import FoldersIcon from 'components/navigation/assets/icons/FoldersIcon';
import PropTypes from 'prop-types';
import SettingsIcon from 'components/navigation/assets/icons/SettingsIcon';
import ThemeIcon from 'components/navigation/assets/icons/ThemeIcon';
import styles from 'components/navigation/assets/styles/Navigation.module.scss';

const Navigation = (props) => {

  const [ active, setActive ] = useState('folders');

  const setFoldersActive = () => {
    props.setAppState({ page: 'home' }, setActive('folders'));
  };

  const setSettingsActive = () => {
    props.setAppState({ page: 'settings' }, setActive('settings'));
  };

  const setClassName = (type) => active === type ? `${styles.active} ${styles.svg}` : styles.svg;

  const toggleAppTheme = () => {
    const { settings: { theme } } = props;
    const otherTheme = theme === 'dark' ? 'light' : 'dark';

    props.updateSetting('theme', otherTheme);
  };

  return (
    <aside className={ styles.aside }>
      <div
        className={ setClassName('folders') }
        onClick={ setFoldersActive }
        title="Select folders"
      >
        <FoldersIcon />
      </div>

      <div
        className={ setClassName('settings') }
        onClick={ setSettingsActive }
        title="Settings"
      >
        <SettingsIcon />
      </div>


      <div
        className={ styles.theme }
        onClick={ toggleAppTheme }
        title="Change theme"
      >
        <ThemeIcon />
      </div>
    </aside>
  )
};

Navigation.propTypes = {
  appState: PropTypes.object.isRequired,
  setAppState: PropTypes.func.isRequired
}

export default Navigation;