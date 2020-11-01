import { Dropdown, DropdownMenuItemType } from 'office-ui-fabric-react/lib/Dropdown';

import { Icon } from 'office-ui-fabric-react/lib/Icon';
import { Label } from 'office-ui-fabric-react/lib/Label';
import PropTypes from 'prop-types';
import React from 'react';
import { Stack } from 'office-ui-fabric-react/lib/Stack';
import supportedLanguages from 'components/pages/settings/util/supportedLanguages';

const languageOptions = [
  { key: 'Header', text: 'Select Language', itemType: DropdownMenuItemType.Header },
  { key: 'chi', text: 'Chinese' },
  { key: 'dut', text: 'Dutch' },
  { key: 'eng', text: 'English' },
  { key: 'spa', text: 'Spanish' },
  { key: 'fre', text: 'French' },
  { key: 'ger', text: 'German' },
  { key: 'ita', text: 'Italian' },
  { key: 'jpn', text: 'Japanese' },
  { key: 'por', text: 'Portuguese' },
  { key: 'rus', text: 'Russian' },
  { key: 'swe', text: 'Swedish' },

  // supported languages from MKVToolNix
  { key: 'Header', text: 'Full Language List', itemType: DropdownMenuItemType.Header },
  ...supportedLanguages
];

const onRenderLabel = (props) => (
  <Stack horizontal verticalAlign="center">
    <Label
      title="Default track when multiple subtitles are merged into a single video"
    >
      { props.label }
    </Label>
    <Icon
      ariaLabel="Language"
      iconName="LocaleLanguage"
      title="Language"
    />
  </Stack>
);

/**
 * @description - Language setting dropdown for settings page
 * @property {object} language - Selected language object with `key` and `text` keys.
 * @property {function} setLanguageSetting - Callback handler to return language data to the parent.
 *
 * @memberof SettingsPage
 */
const LanguageSettings = (props) => {
  const {
    language: { text, key },
    setLanguageSetting
  } = props;

  const onKeyDown = (event) => {
    const option = languageOptions.find((language) => {
      return language.key[0] === event.key;
    });

    if(option)
      setLanguageSetting(event, option);
  };

  return (
    <Dropdown
      placeholder={ text }
      label="Default language track"
      ariaLabel="Default language track"
      onChange={ setLanguageSetting }
      onKeyDown={ onKeyDown }
      onRenderLabel={ onRenderLabel }
      options={ languageOptions }
      selectedKey={ key }
    />
  );
};

LanguageSettings.propTypes = {
  language: PropTypes.object,
  setLanguageSetting: PropTypes.func
};


export default LanguageSettings;