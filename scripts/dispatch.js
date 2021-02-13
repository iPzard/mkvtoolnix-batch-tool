const [ , , script, command ] = process.argv;
const { Builder } = require('./build');
const { Starter } = require('./start');
const { Packager } = require('./package');

/**
 * @namespace Dispatcher
 * @description - Dispatches script commands to various scripts.
 * @argument script - Script manager to use (e.g., build or package).
 * @argument command - Command argument describing exact script to run.
 */

switch(script) {
  case 'build':
    return buildApp();

  case 'package':
    return packageApp();

  case 'start':
    return startDeveloperMode();
}

/**
 * @description - Builds various production builds (e.g., Python, React).
 * @memberof Dispatcher
 */
function buildApp() {
  const builder = new Builder();

  switch(command) {
    case 'react':
      return builder.buildReact();

    case 'python':
      return builder.buildPython();

    case 'all':
      return builder.buildAll();
  }
};

/**
 * @description - Builds various installers (e.g., DMG, MSI).
 * @memberof Dispatcher
 */
function packageApp() {
  const packager = new Packager();

  switch(command) {
    case 'windows':
      return packager.packageWindows();

    case 'mac':
      return packager.packageMacOS();
  }
};

/**
 * @description - Starts developer mode of app.
 * Including; React, Electron, and Python/Flask.
 * @memberof Dispatcher
 */
function startDeveloperMode() {
  const start = new Starter();
  start.developerMode();
};