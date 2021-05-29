import { PrimaryButton } from 'office-ui-fabric-react';
import PropTypes from 'prop-types';
import React from 'react';
import styles from 'components/footer/assets/styles/Footer.module.scss';

/**
 * @namespace Footer
 * @property {string|null} [buttonClassName=null] - Optional class name for button.
 * @property {function} buttonOnClick - On click handler for button.
 * @property {string|null} [buttonIcon=null] - Footer button icon.
 * @property {string} buttonText - Footer button text.
 * @property {string} buttonTitle - Title for button element.
 * @property {boolean} [disabled=false] - Boolean determining if button is disabled.
 */
const Footer = (props) => {
  const {
    buttonClassName = null,
    buttonOnClick,
    buttonIcon = null,
    buttonText,
    buttonTitle,
    disabled = false
  } = props;

  const className = buttonClassName
    ? `${styles['continue-button']} ${styles[buttonClassName]}`
    : styles['continue-button'];

  return (
    <footer className={styles.footer}>
      <PrimaryButton
        className={className}
        disabled={disabled}
        iconProps={{ iconName: buttonIcon }}
        onClick={buttonOnClick}
        text={buttonText}
        title={buttonTitle}
      />
    </footer>
  );
};

Footer.propTypes = {
  buttonClassName: PropTypes.string,
  buttonOnClick: PropTypes.func.isRequired,
  buttonIcon: PropTypes.string,
  buttonText: PropTypes.string.isRequired,
  disabled: PropTypes.bool
};

Footer.defaultProps = {
  buttonClassName: null,
  buttonIcon: null,
  disabled: false
};

export default Footer;
