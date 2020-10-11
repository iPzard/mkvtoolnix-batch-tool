const { spawnSync } = require('child_process');

/**
 * @namespace Builder
 * @description - Builds React & Python builds of project so Electron can be used.
 */

class Builder {

  /**
   * @description - Creates React and Python production builds.
   * @memberof Builder
   */
  buildAll = () => {
    const { buildPython, buildReact } = this;

    buildPython();
    buildReact();
  }

  /**
   * @description - Creates production build of Python back end.
   * @memberof Builder
   */
  buildPython = () => {
    console.log('Creating Python distribution files...');

    const app = 'app.py';
    const icon = './public/favicon.ico';

    const options = [
      '--noconsole', // No shell
      '--noconfirm', // Don't confirm overwrite
      '--distpath ./resources', // Dist (out) path
      `--icon ${icon}` // Icon to use
    ].join(' ');
    // TODO: Check if python is installed.. If not, prompt user
    // "Python is required but not installed, install it? (y/n)"
    spawnSync(`pyinstaller ${options} ${app}`, { detached: false, shell: true, stdio: 'inherit' });
  }

  /**
   * @description - Creates production build of React front end.
   * @memberof Builder
   */
  buildReact = () => {
    console.log('Creating React distribution files...');
    spawnSync(`react-scripts build`, { detached: false, shell: true, stdio: 'inherit' });
  }
}

module.exports.Builder = Builder;