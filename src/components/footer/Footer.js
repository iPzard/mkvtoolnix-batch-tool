import { PrimaryButton } from 'office-ui-fabric-react';
import PropTypes from 'prop-types';
import React from 'react';
import styles from 'components/footer/assets/styles/Footer.module.scss';

/**
 * @namespace Footer
 * @property {string|null} [buttonIcon=null] - Footer button icon.
 * @property {string} buttonText - Footer button text.
 * @property {boolean} [disabled=false] - Boolean determining if button is disabled.
 */
 const Footer = (props) => {

  const {
    buttonClassName,
    buttonIcon = null,
    buttonText,
    disabled = false
  } = props;

  const className = buttonClassName
    ? `${styles['continue-button']} ${styles[buttonClassName]}`
    : styles['continue-button'];

  return (
    <footer className={ styles.footer } >
      <PrimaryButton
        className={ className }
        disabled={ disabled }
        iconProps={{ iconName: buttonIcon }}
        text={ buttonText }
      />
    </footer>
  );
};

Footer.propTypes = {
  buttonIcon: PropTypes.string,
  buttonText: PropTypes.string.isRequired,
  disabled: PropTypes.string
};

Footer.defaultProps = {
  buttonIcon: null,
  disabled: false
};

export default Footer;