const [ , , script, command ] = process.argv;
const { Builder } = require('./build');
const { Cleaner } = require('./clean');
const { Packager } = require('./package');
const { Starter } = require('./start');



/**
 * @namespace Dispatcher
 * @description - Dispatches script commands to various scripts.
 * @argument script - Script manager to use (e.g., build or package).
 * @argument command - Command argument describing exact script to run.
 */

switch (script) {
  case 'build':
    return buildApp();

  case 'clean':
    return cleanProject();

  case 'package':
    return packageApp();

  case 'start':
    return startDeveloperMode();

  // no default
}

/**
 * @description - Builds various production builds (e.g., Python, React).
 * @memberof Dispatcher
 */
function buildApp() {
  const builder = new Builder();

  switch (command) {
    case 'react':
      return builder.buildReact();

    case 'python':
      return builder.buildPython();

    case 'all':
      return builder.buildAll();

    // no default
  }
}

/**
 * @description - Cleans project by removing various files and folders.
 * @memberof Dispatcher
 */
function cleanProject() {
  const cleaner = new Cleaner();
  const getPath = (...path) => path.join(__dirname, '..', ...path);

  // Files to remove during cleaning
  [
    // Cache
    getPath('app.pyc'),
    getPath('app.spec'),
    getPath('app.debug.spec'),
    getPath('__pycache__'),

    // Debug
    getPath('npm-debug.log'),
    getPath('yarn-debug.log'),
    getPath('yarn-error.log'),
    getPath('logs'),

    // Dependencies
    getPath('.pnp'),
    getPath('.pnp.js'),
    getPath('node_modules'),
    getPath('package-lock.json'),
    getPath('yarn.lock'),

    // Testing
    getPath('coverage'),

    // Production
    getPath('build'),
    getPath('dist'),
    getPath('docs'),

    // Misc
    getPath('.DS_Store')
  ]
    // Iterate and remove process
    .forEach(cleaner.removePath);
  // eslint-disable-next-line no-console
  console.log('Project is clean.');
}

/**
 * @description - Builds various installers (e.g., DMG, MSI).
 * @memberof Dispatcher
 */
function packageApp() {
  const packager = new Packager();

  switch (command) {
    case 'windows':
      return packager.packageWindows();

    case 'mac':
      return packager.packageMacOS();

    // no default
  }
}

/**
 * @description - Starts developer mode of app.
 * Including; React, Electron, and Python/Flask.
 * @memberof Dispatcher
 */
function startDeveloperMode() {
  const start = new Starter();
  start.developerMode();
}
