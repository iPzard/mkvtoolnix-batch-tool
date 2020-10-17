import React, { useEffect, useState } from 'react';

import { Label } from 'office-ui-fabric-react/lib/Label';
import PropTypes from 'prop-types';
import Spinner from 'components/pages/main/assets/icons/Spinner';
import styles from 'components/pages/main/assets/styles/LoadingScreen.module.scss';

/**
 * @description - Loading screen for when data is processing
 * @property {boolean} isVisible - Determines whether or not to show loading screen.
 *
 * @memberof MainPage
 */

const LoadingScreen = (props) => {
  const { isVisible } = props;
  const [fadedIn, setFadedIn] = useState(false);

  useEffect(() => {
    setFadedIn(true);
    return ()=> setFadedIn(false);
  }, []);

  const spinnerContainerClassName = fadedIn
    ? styles.spinner
    : `${styles.spinner} ${styles.hidden}`;


  return isVisible ? (
    <div className={ spinnerContainerClassName }>
      <Spinner className={ styles['spinner-icon'] } />
      <Label className={ styles.label }>Your files are being processed</Label>
    </div>
  ) : null;
};


LoadingScreen.propTypes = {
  isVisible: PropTypes.bool.isRequired
};

export default LoadingScreen;