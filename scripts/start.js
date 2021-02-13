const { spawn } = require('child_process');
const spawnOptions = { detached: false, shell: true, stdio: 'inherit' };

/**
 * @namespace Starter
 * @description - Scripts to start Electron, React, and Python.
 */
class Starter {

  /**
   * @description - Starts developer mode.
   * @memberof Starter
   */
  developerMode = () => {
    spawn(`cross-env BROWSER=none react-scripts start`, spawnOptions);
    spawn('electron .', spawnOptions);
  };

}

module.exports = { Starter };