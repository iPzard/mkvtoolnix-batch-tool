import React, { Component, Fragment } from 'react';

import { DefaultButton, PrimaryButton } from 'office-ui-fabric-react';
import { Checkbox } from 'office-ui-fabric-react/lib/Checkbox';
import { Dropdown } from 'office-ui-fabric-react/lib/Dropdown';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import { Label } from 'office-ui-fabric-react/lib/Label';

import LoadingScreen from 'components/pages/main/LoadingScreen';
import Notice from 'components/dialog/Notice';
import Footer from 'components/footer/Footer';
import InputField from 'components/pages/main/InputField';

import { getDirectory } from 'utils/services';
import { post } from 'utils/requests';

import PropTypes from 'prop-types';

import styles from 'components/pages/main/assets/styles/MainPage.module.scss';

/**
 * @namespace MainPage
 * @description - Main page of the app where files are merged.
 *
 * @property {object} appState - Global app state.
 * @property {function} setAppState - Function to set global app state.
 * @property {object} settings - User defined, persistent settings.
 * @property {function} updateMultipleSettings - Function to update multiple user defined settings at once.
 * @property {function} updateSetting - Function to update a single setting at a time.
 *
 * @memberof Pages
 */
class MainPage extends Component {
  state = {
    hideDialog: true,
    loading: false,
    messageText: '',
    messageTitle: '',
    processingOption: {
      data: { icon: 'FabricSyncFolder' },
      key: 'merge',
      text: 'Merge',
      title: 'Merge subtitles into video files'
    }
  };

  // Generic method to update directories
  setDirectory = (type, callback) =>
    getDirectory((directory) =>
      this.props.setAppState(
        { [type]: directory },
        callback && callback(directory)
      ));

  // Method to update the input directory
  setInput = (path) => {
    if (typeof path === 'string') this.props.setAppState({ input: path });
    else this.setDirectory('input');
  };

  // Method to update the output directory
  setOutput = () => {
    if (this.props.settings.isRememberOutputDir) {
      this.setDirectory('output', (directory) => {
        this.props.updateSetting('outputDir', directory);
      });
    } else this.setDirectory('output');
  };

  /**
   * @todo - add extract info
   */
  onChangeModeToggle = (option) => {
    const { updateMultipleSettings } = this.props;
    const isRemoveSubtitles = option === 'remove';
    const isExtractSubtitles = option === 'extract';

    updateMultipleSettings({
      isExtractSubtitles,
      isRemoveSubtitles
    });
  };

  // Method to update "Same as source" option for output
  onChangeSameAsSource = () => {
    const {
      props: {
        settings: { isSameAsSource, isRememberOutputDir },
        updateMultipleSettings
      }
    } = this;

    if (isSameAsSource && isRememberOutputDir) {
      updateMultipleSettings({
        isSameAsSource: false,
        outputDir: this.props.appState.output || null
      });
    } else {
      updateMultipleSettings({
        isSameAsSource: !isSameAsSource,
        outputDir: null
      });
    }
  };

  processBatch = () => {
    const {
      props: { appState, settings }
    } = this;
    const { input, output } = appState;

    // Start spinner
    this.setState({ loading: true }, () => {
      const requestBody = JSON.stringify({ input, output, settings });

      // Stop spinner on response and display message
      post(
        requestBody,
        'process_batch',

        // Success callback
        (response) => {
          this.setState({
            hideDialog: false,
            loading: false,
            messageText:
              response.error
              || response.warning
              || 'Batch successfully processed without any errors or warnings.',
            messageTitle: response.status
          });
        },

        // Error callback
        (error) => {
          // Log error
          console.error(error);

          this.setState({
            hideDialog: false,
            loading: false,
            messageText:
              'There was an error which prevented the batch from being processed.',
            messageTitle: 'Error'
          });
        }
      );
    });
  };

  setHideDialog = (setting) => this.setState({ hideDialog: setting });

  render() {
    const {
      onChangeSameAsSource,
      onChangeModeToggle,
      processBatch,
      props: {
        appState: { input, output },
        settings: {
          isRememberOutputDir,
          isRemoveSubtitles,
          isSameAsSource,
          outputDir
        }
      },
      setHideDialog,
      setInput,
      setOutput,
      state: { hideDialog, loading, messageText, messageTitle }
    } = this;

    // Determine if same as source or not
    const isFooterDisabled = Boolean(
      isSameAsSource ? !input : !input || !output
    );

    // Determine same as source input text
    const outputValue = {
      [true]: output,
      [Boolean(isRememberOutputDir && outputDir)]: outputDir,
      [isSameAsSource]: input,
      [Boolean(isSameAsSource && input)]: input + String.raw`\*`
    }.true;


    const onRenderOption = (option) => {
      return (
        <div style={ { display: 'flex' } } title={ option.data.title }>
          <Icon
            iconName={ option.data.icon }
            title={ option.data.icon }
          />
          <span style={ { marginLeft: 6, paddingBottom: 5 } }>{option.text}</span>
        </div>
      );
    };

    return (
      <Fragment>
        {loading ? <LoadingScreen /> : null}
        <Notice
          hideDialog={ hideDialog }
          messageText={ messageText }
          messageTitle={ messageTitle }
          setHideDialog={ setHideDialog }
        />

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
            value={ outputValue }
          />

          <Checkbox
            checked={ isSameAsSource }
            className={ styles.checkbox }
            label="Output same as source"
            onChange={ onChangeSameAsSource }
            title="Use video source directories for output"
          />

          <div className={ styles['mode-settings'] }>
            <Label>
              Subtitle processing mode
            </Label>
            <Dropdown
              onChange={ (event, option) => {
                this.setState({ processingOption: option },
                  () => onChangeModeToggle(option.key));
              } }
              onRenderOption={ onRenderOption }
              options={ [
                {
                  data: { icon: 'FabricSyncFolder' },
                  key: 'merge',
                  text: 'Merge',
                  title: 'Merge subtitles into video files'
                },
                {
                  data: { icon: 'FabricUnsyncFolder' },
                  key: 'remove',
                  text: 'Remove',
                  title: 'Remove subtitles from video files'
                },
                {
                  data: { icon: 'FabricFormLibrary' },
                  key: 'extract',
                  text: 'Extract',
                  title: 'Extract subtitles from video files'
                }
              ] }
              placeholder="Select mode"
              styles={ { dropdown: { width: 280 } } }
            />
          </div>

          <Footer
            buttonIcon={ this.state.processingOption.data.icon }
            buttonOnClick={ processBatch }
            buttonText={ this.state.processingOption.text }
            buttonTitle={ this.state.processingOption.title }
            disabled={ isFooterDisabled }
          />
        </section>
      </Fragment>
    );
  }
}

MainPage.propTypes = {
  appState: PropTypes.object.isRequired,
  setAppState: PropTypes.func.isRequired,
  settings: PropTypes.object.isRequired,
  updateMultipleSettings: PropTypes.func,
  updateSetting: PropTypes.func
};

export default MainPage;
