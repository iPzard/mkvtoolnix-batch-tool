import React, { useEffect, useState } from 'react';

import { Label } from 'office-ui-fabric-react/lib/Label';
import Spinner from 'components/pages/main/assets/icons/Spinner';
import styles from 'components/pages/main/assets/styles/LoadingScreen.module.scss';

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

export default LoadingScreen;