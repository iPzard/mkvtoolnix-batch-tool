import React, { Component } from 'react';

import Footer from 'components/footer/Footer';
import InputField from 'components/home/InputField';
import { getDirectory } from 'utils/services';
import styles from 'components/home/assets/styles/Home.module.scss';

// import PropTypes from 'prop-types';

/**
 * @namespace Home
 * @description - Main page of the app.
 */

class Home extends Component {

  // Input & output directories
  state = {
    input: '',
    output: ''
  }

  // Generic method to update directories
  setDirectory = (type) => getDirectory((directory) => this.setState({ [type]: directory }));

  // Method to update the input directory
  setInput = () => this.setDirectory('input');

  // Method to update the output directory
  setOutput = () => this.setDirectory('output');


  render() {
    const {
      setInput,
      setOutput,
      state: { input, output }
    } = this;


    return(
      <section className={ styles.container }>
        <InputField
          label="Source directory"
          placeholder="Select source directory"
          setValue={ setInput }
          value={ input }
        />

        <InputField
          label="Output directory"
          placeholder="Select output directory"
          setValue={ setOutput }
          value={ output }
        />

        <Footer
          buttonIcon="Sync"
          buttonText="Merge"
          disabled={ !input || !output }
        />
      </section>
    );
  };

}

// Home.propTypes = { };

export default Home;
