import React, { Component } from 'react';

import { Checkbox } from 'office-ui-fabric-react/lib/Checkbox';
import Footer from 'components/footer/Footer';
import InputField from 'components/homepage/InputField';
import PropTypes from 'prop-types';
import { getDirectory } from 'utils/services';
import { settings } from 'utils/settings';
import styles from 'components/homepage/assets/styles/HomePage.module.scss';

/**
 * @namespace HomePage
 * @description - Main page of the app.
 *
 * @property {object} appState - Global app state.
 * @property {function} setAppState - Function to set global app state.
 */
class Home extends Component {

  // Generic method to update directories
  setDirectory = (type) => getDirectory((directory) => this.props.setAppState({ [type]: directory }));

  // Method to update the input directory
  setInput = () => this.setDirectory('input');

  // Method to update the output directory
  setOutput = () => this.setDirectory('output');

  // Method to update "Same as source" option for output
  onChangeSameAsSource = () => {
    const isSameAsSource = this.props.settings.isSameAsSource;
    const updateSetting = this.props.updateSetting;

    updateSetting('isSameAsSource', !isSameAsSource);
  };

  render() {
    const {
      onChangeSameAsSource,
      props: {
        appState: { input, output },
        settings: { isSameAsSource }
      },
      setInput,
      setOutput
    } = this;

    const isFooterDisabled = isSameAsSource
      ? !input
      : !input || !output;

    return(
      <section className={ styles.home }>
        <InputField
          label="Source directory"
          placeholder="Select source directory"
          setValue={ setInput }
          value={ input }
        />

        <InputField
          disabled={ isSameAsSource }
          label="Output directory"
          placeholder="Select output directory"
          setValue={ setOutput }
          value={ isSameAsSource ? input : output }
        />

        <Checkbox
          className={ styles.checkbox }
          label="Same as source"
          onChange={ onChangeSameAsSource }
          checked={ isSameAsSource }
        />

        <Footer
          buttonIcon="Sync"
          buttonText="Merge"
          disabled={ isFooterDisabled }
        />
      </section>
    );
  };

}

Home.propTypes = {
  appState: PropTypes.object.isRequired,
  setAppState: PropTypes.func.isRequired
};

export default Home;
