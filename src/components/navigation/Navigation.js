import React, { useState } from 'react';

import FoldersIcon from 'components/navigation/assets/icons/FoldersIcon';
import PropTypes from 'prop-types';
import SettingsIcon from 'components/navigation/assets/icons/SettingsIcon';
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
        className={ styles.svg }
        className={ setClassName('settings') }
        onClick={ setSettingsActive }
        title="Settings"
      >
        <SettingsIcon />
      </div>
    </aside>
  )
};

Navigation.propTypes = {
  appState: PropTypes.object.isRequired,
  setAppState: PropTypes.func.isRequired
}

export default Navigation;