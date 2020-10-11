import {
  MessageBar,
  MessageBarType
} from 'office-ui-fabric-react';

import PropTypes from 'prop-types';
import React from 'react';

/**
 * @namespace Footer
 * @description - Generic toast component to display messages to the end user.
 *
 * @property {node} children - Child components to render within the toast display.
 * @property {Function} onDismiss - Function to execute when close is clicked (optional).
 * @property {boolean} show - Boolean to determine whether or not to show the toast message.
 * @property {string} type - Boolean to determine which type of toast message to use.
 * @property {Object} containerProps - Props to pass to the toast container component (optional).
 * @tutorial - https://developer.microsoft.com/en-us/fluentui#/controls/web/messagebar
 */

const Toast = (props) => {
  const {
    children,
    onDismiss,
    show,
    type,
    ...containerProps
  } = props;

  return (
    show ?
    <aside { ...containerProps } >
      <MessageBar
        messageBarType={ MessageBarType[type] }
        isMultiline={ false }
        onDismiss={ onDismiss }
        dismissButtonAriaLabel="Close"
      >
        { children }
      </MessageBar>
    </aside> :
    null
  );
};

Toast.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]).isRequired,
  onDismiss: PropTypes.func,
  show: PropTypes.bool,
  type: PropTypes.string
};

export default Toast;