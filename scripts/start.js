const { spawn } = require('child_process');
const getPort = require('get-port');
const { get } = require('axios');

/**
 * @namespace Starter
 * @description - Scripts to start Electron, React, and Python.
 */
class Starter {

  /**
   * @description - Starts developer mode.
   * @memberof Starter
   */
  developerMode = async () => {

    // Child spawn options for console
    const spawnOptions = {
      hideLogs: { detached: false, shell: true, stdio: 'pipe' },
      showLogs: { detached: false, shell: true, stdio: 'inherit' }
    };

    /**
     * Method to get first port in range of 3001-3999,
     * Remains unused here so will be the same as the
     * port used in main.js
     */
    const port = await getPort({
      port: getPort.makeRange(3001, 3999)
    });

    // Kill anything that might using required React port
    spawn(`npx kill-port 3000`, spawnOptions.hideLogs);

    // Start & identify React & Electron processes
    spawn(`cross-env BROWSER=none react-scripts start`, spawnOptions.showLogs);
    spawn('electron .', spawnOptions.showLogs);

    // Kill processes on exit
    const exitOnEvent = (event) => {
      process.once(event, () => {
        try {

          // These errors are expected since the connection is closing
          const expectedErrors = ['ECONNRESET', 'ECONNREFUSED'];

          // Send command to Flask server to quit and close
          get(`http://localhost:${port}/quit`)
            .catch((error) => !expectedErrors.includes(error.code) && console.log(error));

        } catch(error) {

          // This errors is expected since the process is closing
          if(error.code !== 'ESRCH') console.error(error);
        }
      });
    };

    const exitEvents = ['exit', 'SIGINT', 'SIGUSR1', 'SIGUSR2', 'uncaughtException', 'SIGTERM'];
    exitEvents.forEach(exitOnEvent);
  };

}

module.exports = { Starter };