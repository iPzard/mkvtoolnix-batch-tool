import React, { Component, Fragment } from 'react';

import { DefaultButton, PrimaryButton } from 'office-ui-fabric-react';
import { Checkbox } from 'office-ui-fabric-react/lib/Checkbox';
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
    messageTitle: ''
  };

  // Generic method to update directories
  setDirectory = (type, callback) =>
    getDirectory((directory) =>
      this.props.setAppState(
        { [type]: directory },
        callback && callback(directory)
      )
    );

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

  onChangeModeToggle = (mode) => {
    const updateSetting = this.props.updateSetting;
    const isRemoveSubtitles = mode === 'remove';
    updateSetting('isRemoveSubtitles', isRemoveSubtitles);
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
              response.error ||
              response.warning ||
              'Batch successfully processed without any errors or warnings.',
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
    }[true];

    // Determine if merging or removing subtitles
    const buttonIcon = isRemoveSubtitles
      ? 'FabricUnsyncFolder'
      : 'FabricSyncFolder';

    // Determine button text
    const buttonText = isRemoveSubtitles ? 'Remove' : 'Merge';

    // Determine button title
    const buttonTitle = isRemoveSubtitles
      ? 'Remove subtitles'
      : 'Merge subtitles';

    // Determine button types for settings
    const SettingButton = (props) => {
      const { type, ...buttonProps } = props;

      switch (type) {
        case 'merge':
          return isRemoveSubtitles ? (
            <DefaultButton {...buttonProps} />
          ) : (
            <PrimaryButton {...buttonProps} />
          );

        case 'remove':
          return isRemoveSubtitles ? (
            <PrimaryButton {...buttonProps} />
          ) : (
            <DefaultButton {...buttonProps} />
          );

        // no default
      }
    };

    return (
      <Fragment>
        {loading ? <LoadingScreen /> : null}
        <Notice
          hideDialog={hideDialog}
          messageText={messageText}
          messageTitle={messageTitle}
          setHideDialog={setHideDialog}
        />

        <section className={styles.home}>
          <InputField
            label="Source directory"
            placeholder="Select source directory"
            setValue={setInput}
            value={input}
          />

          <InputField
            disabled={isSameAsSource}
            label="Output directory"
            placeholder="Select output directory"
            setValue={setOutput}
            value={outputValue}
          />

          <Checkbox
            checked={isSameAsSource}
            className={styles.checkbox}
            label="Output same as source"
            onChange={onChangeSameAsSource}
            title="Use video source directories for output"
          />

          <div className={styles['mode-settings']}>
            <Label>
              Subtitle processing mode{' '}
              <i>({`${buttonText.toLowerCase()} selected`})</i>
            </Label>

            <div>
              <SettingButton
                onClick={() => onChangeModeToggle('merge')}
                text="Merge"
                title="Merge subtitles"
                type="merge"
              />
              <SettingButton
                onClick={() => onChangeModeToggle('remove')}
                text="Remove"
                title="Remove subtitles"
                type="remove"
              />
            </div>
          </div>

          <Footer
            buttonIcon={buttonIcon}
            buttonOnClick={processBatch}
            buttonText={buttonText}
            buttonTitle={buttonTitle}
            disabled={isFooterDisabled}
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
