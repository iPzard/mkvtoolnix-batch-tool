import React, { Component } from 'react';

import { Label } from 'office-ui-fabric-react/lib/Label';
import Spinner from 'components/pages/main/assets/icons/Spinner';
import { socket } from 'utils/requests';
import styles from 'components/pages/main/assets/styles/LoadingScreen.module.scss';

/**
 * @description - Loading screen for when data is processing
 * @memberof MainPage
 */
class LoadingScreen extends Component {
  state = {
    batchSize: 0,
    currentCount: 0
  };

  setBatchSize = (batchSize) => {
    this.setState({ batchSize });
  };

  processDirectory = () => {
    this.setState({ currentCount: this.state.currentCount + 1 });
  };

  componentDidMount() {
    // Configure socket communication
    socket.on('batch_size', this.setBatchSize);
    socket.on('processing_subdirectory', this.processDirectory);
  }

  componentWillUnmount() {
    // Disconnect socket on unmount
    socket.off('batch_size', this.setBatchSize);
    socket.off('processing_subdirectory', this.processDirectory);
  }

  render() {
    const {
      state: { batchSize, currentCount }
    } = this;

    return (
      <div className={styles.spinner}>
        <Spinner className={styles['spinner-icon']} />
        <Label className={styles.label}>
          {`Batch in progress, processing ${currentCount} of ${batchSize}`}
        </Label>
      </div>
    );
  }
}

export default LoadingScreen;
