import { DefaultButton } from 'office-ui-fabric-react';
import PropTypes from 'prop-types';
import React from 'react';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import styles from 'components/merge/assets/styles/InputField.module.scss';

/**
 * @description - Input section component
 * @property {function} handleOnChange - function to handle onChange
 * @property {string} label - Input label.
 * @property {string} placeholder - Input placeholder.
 * @property {function} setValue - function set input value.
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
  label: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  setValue: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired
};

export default InputField;