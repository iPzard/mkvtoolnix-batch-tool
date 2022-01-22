import { Dropdown, DropdownMenuItemType } from 'office-ui-fabric-react/lib/Dropdown';
import React, { useEffect, useMemo, useState } from 'react';

import { Icon } from 'office-ui-fabric-react/lib/Icon';
import { Label } from 'office-ui-fabric-react/lib/Label';
import PropTypes from 'prop-types';
import { Stack } from 'office-ui-fabric-react/lib/Stack';
import { get } from 'utils/requests';

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

  // Primary languages to select from
  const primaryLanguageOptions = useMemo(() => ([
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
    { key: 'swe', text: 'Swedish' }
  ]), []);

  const [languageOptions, setLanguageOptions] = useState(primaryLanguageOptions);

  // Additional supported languages (from MKVToolNix)
  useEffect(() => {

    // Create hashmap of existing keys for reference
    const existingKeys = primaryLanguageOptions.reduce((acc, languageOption) => {
      acc[languageOption.key] = true;
      return acc;
    }, {});

    get('supported_languages', (languages) => {
      const additionalLanguageOptions = [
        {
          key: 'additional-languages',
          text: 'Full Language List',
          itemType: DropdownMenuItemType.Header
        },

        // Don't include existing (primary) languages
        ...Object.values(languages).filter((option) => {
          return !(option.key in existingKeys);
        })
      ];

      // Combine primary and additional language options
      setLanguageOptions([
        ...primaryLanguageOptions,
        ...additionalLanguageOptions
      ]);
    });
  }, [primaryLanguageOptions]);

  const onKeyDown = (event) => {
    const option = languageOptions.find((language) => {
      return language.key[0] === event.key;
    });

    if (option) {
      setLanguageSetting(event, option);
    }
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
  language: PropTypes.object.isRequired,
  setLanguageSetting: PropTypes.func.isRequired
};


export default LanguageSettings;