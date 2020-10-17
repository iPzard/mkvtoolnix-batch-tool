import { DefaultButton, PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import { Dialog, DialogFooter, DialogType } from 'office-ui-fabric-react/lib/Dialog';
import React, { useMemo } from 'react';

import PropTypes from 'prop-types';
import { useId } from '@uifabric/react-hooks';

/**
 * @namespace Notice
 * @description - Generic notice component to display messages to the end user.
 *
 * @property {string} [okayText=Confirm] - Text to show in the primary button.
 * @property {string} [cancelText=Cancel] - Text to show in the secondary button.
 * @property {Function} okayFunc - Function to execute when the primary button is clicked.
 * @property {Function} cancelFunc - Function to execute when the secondary button is clicked.
 * @property {boolean} hideDialog - Boolean to determine if the dialog should be shown.
 * @property {string} messageText - Text to show as the main message.
 * @property {Function} setHideDialog - Function used to set the `hideDialog` boolean.
 * @property {string} title - Text to show as the title of the notice.
 * @tutorial - https://developer.microsoft.com/en-us/fluentui#/controls/web/dialog
 */

export const Notice = (props) => {

  const {
    hideDialog,
    messageText,
    messageTitle,
    setHideDialog
  } = props;

  const dialogContentProps = {
    type: DialogType.normal,
    title: messageTitle,
    closeButtonAriaLabel: 'Close',
    subText: messageText,
  };

  // Ensure unique IDs
  const labelId = useId('dialogLabel');
  const subTextId = useId('subTextLabel');

  const modalProps = useMemo(() => ({
    titleAriaId: labelId,
    subtitleAriaId: subTextId,
    isBlocking: false,
    styles: { main: { maxWidth: 450 } },
  }), [labelId, subTextId]);

  const toggleHideDialog = () => setHideDialog(!hideDialog);

  return (
    <Dialog
      hidden={ hideDialog }
      onDismiss={ toggleHideDialog }
      dialogContentProps={ dialogContentProps }
      modalProps={ modalProps }
    >
      <DialogFooter>
        <PrimaryButton onClick={ toggleHideDialog } text="Okay" />
      </DialogFooter>
    </Dialog>
  );
};


Notice.propTypes = {
  okayText: PropTypes.string,
  cancelText: PropTypes.string,
  okayFunc: PropTypes.func,
  cancelFunc: PropTypes.func,
  hideDialog: PropTypes.bool,
  messageText: PropTypes.string,
  setHideDialog: PropTypes.func,
  title: PropTypes.string
};

export default Notice;