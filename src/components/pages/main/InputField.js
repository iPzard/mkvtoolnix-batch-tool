import { DefaultButton } from 'office-ui-fabric-react';
import PropTypes from 'prop-types';
import React from 'react';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import styles from 'components/pages/main/assets/styles/InputField.module.scss';

/**
 * @description - Input section component
 * @property {boolean} disabled - Determines whether input field is disabled or not.
 * @property {string} label - Input label.
 * @property {string} placeholder - Input placeholder.
 * @property {function} setValue - Function set input value.
 * @property {string} type - Type of input field (e.g., input or output directory).
 * @property {string} value - Current value of input field.
 *
 * @memberof Home
 */

const InputField = (props) => {
  const {
    disabled,
    label,
    placeholder,
    setValue,
    value
  } = props;

  const onDrop = (event) => {
    const path = event.dataTransfer.files[0].path;
    setValue(path);
  };

  return (
    <article className={ styles['input-block'] }>
      <TextField
        className={ styles['input-field'] }
        disabled={ disabled }
        label={ label }
        placeholder={ placeholder }
        onClick={ setValue }
        onChange={ setValue }
        value={ value }
        webkitdirectory
        onDrop={onDrop}
      />

      <DefaultButton
        className={ styles['browse-button'] }
        disabled={ disabled }
        iconProps={{ iconName: 'FabricFolderSearch' }}
        onClick={ setValue }
        text="Browse..."
      />
    </article>
  )
};

InputField.propTypes = {
  disabled: PropTypes.bool,
  label: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  setValue: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired
};

export default InputField;