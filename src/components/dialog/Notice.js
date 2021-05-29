import React, { useMemo } from 'react';
import {
  Dialog,
  DialogFooter,
  DialogType
} from 'office-ui-fabric-react/lib/Dialog';

import { PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import { useId } from '@uifabric/react-hooks';

import PropTypes from 'prop-types';

/**
 * @namespace Notice
 * @description - Generic notice component to display messages to the end user.
 *
 * @property {boolean} hideDialog - Boolean to determine if the dialog should be shown.
 * @property {string} messageText - Text to show as the main message.
 * @property {string} messageTitle - Text to show as the title of the notice.
 * @property {function} setHideDialog - Function used to set the `hideDialog` boolean.
 * @tutorial - https://developer.microsoft.com/en-us/fluentui#/controls/web/dialog
 */

export const Notice = (props) => {
  const { hideDialog, messageText, messageTitle, setHideDialog } = props;

  const dialogContentProps = {
    type: DialogType.normal,
    title: messageTitle,
    closeButtonAriaLabel: 'Close',
    subText: messageText
  };

  // Ensure unique IDs
  const labelId = useId('dialogLabel');
  const subTextId = useId('subTextLabel');

  const modalProps = useMemo(
    () => ({
      titleAriaId: labelId,
      subtitleAriaId: subTextId,
      isBlocking: false,
      styles: { main: { maxWidth: 450 } }
    }),
    [labelId, subTextId]
  );

  const toggleHideDialog = () => setHideDialog(!hideDialog);

  return (
    <Dialog
      hidden={hideDialog}
      onDismiss={toggleHideDialog}
      dialogContentProps={dialogContentProps}
      modalProps={modalProps}
    >
      <DialogFooter>
        <PrimaryButton onClick={toggleHideDialog} text="Okay" />
      </DialogFooter>
    </Dialog>
  );
};

Notice.propTypes = {
  hideDialog: PropTypes.bool.isRequired,
  messageText: PropTypes.string.isRequired,
  setHideDialog: PropTypes.func.isRequired,
  messageTitle: PropTypes.string.isRequired
};

export default Notice;
