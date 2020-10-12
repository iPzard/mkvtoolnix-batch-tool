import { Dropdown, DropdownMenuItemType } from 'office-ui-fabric-react/lib/Dropdown';

import { Icon } from 'office-ui-fabric-react/lib/Icon';
import { Label } from 'office-ui-fabric-react/lib/Label';
import React from 'react';
import { Stack } from 'office-ui-fabric-react/lib/Stack';

const languageOptions = [
  { key: 'Header', text: 'Select Language', itemType: DropdownMenuItemType.Header },
  { key: 'chinese', text: 'Chinese' },
  { key: 'dutch', text: 'Dutch' },
  { key: 'english', text: 'English' },
  { key: 'french', text: 'French' },
  { key: 'german', text: 'German' },
  { key: 'italian', text: 'Italian' },
  { key: 'japanese', text: 'Japanese' },
  { key: 'portuguese', text: 'Portuguese' },
  { key: 'russian', text: 'Russian' },
  { key: 'swedish', text: 'Swedish' },
];

const onRenderLabel = (props) => (
  <Stack horizontal verticalAlign="center">
    <Label>{props.label}</Label>
      <Icon
      iconName="LocaleLanguage"
      ariaLabel="Language"
      title="Language"
      />
  </Stack>
);

const onRenderTitle = (options) => (
  <div>
    <span>{options[0].text}</span>
  </div>
);

const LanguageSettings = (props) => (
  <div>
    <Stack>
      <Dropdown
        placeholder="English"
        label="Select a Language"
        ariaLabel="Select a Language"
        onRenderTitle={ onRenderTitle }
        onRenderLabel={ onRenderLabel }
        options={ languageOptions }
        { ...props }
      />
    </Stack>
  </div>
);

export default LanguageSettings;