import { Dropdown, DropdownMenuItemType } from 'office-ui-fabric-react/lib/Dropdown';

import { Icon } from 'office-ui-fabric-react/lib/Icon';
import { Label } from 'office-ui-fabric-react/lib/Label';
import React from 'react';
import { Stack } from 'office-ui-fabric-react/lib/Stack';

const languageOptions = [
  { key: 'Header', text: 'Select Language', itemType: DropdownMenuItemType.Header },
  { key: 'chi', text: 'Chinese' },
  { key: 'dut', text: 'Dutch' },
  { key: 'eng', text: 'English' },
  { key: 'fre', text: 'French' },
  { key: 'ger', text: 'German' },
  { key: 'ita', text: 'Italian' },
  { key: 'jpn', text: 'Japanese' },
  { key: 'por', text: 'Portuguese' },
  { key: 'rus', text: 'Russian' },
  { key: 'swe', text: 'Swedish' },
];

const onRenderLabel = (props) => (
  <Stack horizontal verticalAlign="center">
    <Label>{ props.label }</Label>
      <Icon
        ariaLabel="Language"
        iconName="LocaleLanguage"
        title="Language"
      />
  </Stack>
);

const LanguageSettings = (props) => (
  <Dropdown
    placeholder={ props.language.text }
    label="Subtitle Language"
    ariaLabel="Subtitle Language"
    onChange={ props.onChange }
    onRenderLabel={ onRenderLabel }
    options={ languageOptions }
    selectedKey={ props.language.key }
  />
);

export default LanguageSettings;