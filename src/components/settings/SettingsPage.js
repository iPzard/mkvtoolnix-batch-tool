import React, { useState } from 'react';

import { Checkbox } from 'office-ui-fabric-react/lib/Checkbox';
import Footer from 'components/footer/Footer';
import LanguageSettings from 'components/settings/LanguageSettings';
import styles from 'components/settings/assets/styles/SettingsPage.module.scss';

const Settings = () => {
  const [ removeFilesSetting, setRemoveFilesSetting ] = useState(false);
  const [ hardcodeSetting, setHardcodeSetting ] = useState(false);
  const [ removeAdsSetting, setRemoveAdsSetting ] = useState(false);

  return (
    <section className={ styles.settings }>
      <LanguageSettings />

      <Checkbox
        checked={ removeFilesSetting }
        className={ styles.checkbox }
        label="Remove old video and subtitle files from source directory"
        onChange={ () => setRemoveFilesSetting(!removeFilesSetting) }
      />

      <Checkbox
        checked={ hardcodeSetting }
        className={ styles.checkbox }
        label="Permanently hard-code subtitles into new video"
        onChange={ () => setHardcodeSetting(!hardcodeSetting) }
      />

      <Checkbox
        checked={ removeAdsSetting }
        className={ styles.checkbox }
        label="Remove advertisements from subtitles"
        onChange={ () => setRemoveAdsSetting(!removeAdsSetting) }
      />

      <Footer
        buttonClassName="save-button"
        buttonIcon="Save"
        buttonText="Save"
        disabled={ false }
      />
    </section>
  )
};

export default Settings;