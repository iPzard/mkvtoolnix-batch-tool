// Built-in modules
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const util = require('util');

// Electron modules
const { app, BrowserWindow, ipcMain } = require('electron');

// Extra modules
const getPort = require('get-port');
const isDevMode = require('electron-is-dev');
const { get } = require('axios');

// Set path to error log
const errorLogPath = path.join(
  process.env.APPDATA,
  'MKVToolNix Batch Tool',
  'error.log'
);

// Prepare file for writing logs
const errorLogFile = fs.createWriteStream(errorLogPath, { flags: 'a' });

// Update console.error so stdout is saved to log file
console.error = (...args) => {
  const now = new Date();
  const message = util.format(...args);

  // Ensure message configuration is same as Flask's
  const timestamp = now.toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).replace(',', '');
  const formattedMessage = `${timestamp} - MKVToolNix Batch Tool - ERROR - ${message}\n`;

  // Write stdout to error.log file
  errorLogFile.write(formattedMessage);
  process.stdout.write(formattedMessage);
};



/**
 * @description - Shuts down Electron & Flask.
 * @param {number} port - Port that Flask server is running on.
 */
const shutdown = (port) => {
  get(`http://localhost:${port}/quit`).then(app.quit).catch(app.quit);
};

/**
 * @namespace BrowserWindow
 * @description - Electron browser windows.
 * @tutorial - https://www.electronjs.org/docs/api/browser-window
 */
const browserWindows = {};

/**
 * @description - Creates main window.
 * @param {number} port - Port that Flask server is running on.
 *
 * @memberof BrowserWindow
 */
const createMainWindow = (port) => {
  const { loadingWindow, mainWindow } = browserWindows;

  /**
   * @description - Function to use custom JavaSCript in the DOM.
   * @param {string} command - JavaScript to execute in DOM.
   * @param {function} callback - Callback to execute here once complete.
   * @returns {promise}
   */
  const executeOnWindow = (command, callback) => {
    return mainWindow.webContents
      .executeJavaScript(command)
      .then(callback)
      .catch(console.error);
  };

  /**
   * If in developer mode, show a loading window while
   * the app and developer server compile.
   */
  if (isDevMode) {
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.hide();

    /**
     * Opening devTools, must be done before dom-ready
     * to avoid occasional error from the webContents
     * object being destroyed.
     */
    mainWindow.webContents.openDevTools({ mode: 'undocked' });

    /**
     * Hide loading window and show main window
     * once the main window is ready.
     */
    mainWindow.webContents.on('did-finish-load', () => {
      /**
       * Checks page for errors that may have occurred
       * during the hot-loading process.
       */
      const isPageLoaded = `
        var isBodyFull = document.body.innerHTML !== "";
        var isHeadFull = document.head.innerHTML !== "";
        var isLoadSuccess = isBodyFull && isHeadFull;

        isLoadSuccess || Boolean(location.reload());
      `;

      /**
       * @description Updates windows if page is loaded
       * @param {*} isLoaded
       */
      const handleLoad = (isLoaded) => {
        if (isLoaded) {
          /**
           * Keep show() & hide() in this order to prevent
           * unresponsive behavior during page load.
           */
          mainWindow.show();
          loadingWindow.destroy();
        }
      };

      /**
       * Checks if the page has been populated with
       * React project. if so, shows the main page.
       */
      executeOnWindow(isPageLoaded, handleLoad);
    });
  } else mainWindow.loadFile(path.join(__dirname, 'build/index.html'));

  /**
   * If using in production, the built version of the
   * React project will be used instead of localhost.
   */

  /**
   * @description - Controls the opacity of title bar on focus/blur.
   * @param {number} value - Opacity to set for title bar.
   */
  const setTitleOpacity = (value) => `
    if(document.readyState === 'complete') {
      const titleBar = document.getElementById('electron-window-title-text');
      const titleButtons = document.getElementById('electron-window-title-buttons');

      if(titleBar) titleBar.style.opacity = ${value};
      if(titleButtons) titleButtons.style.opacity = ${value};
    }
  `;

  mainWindow.on('focus', () => executeOnWindow(setTitleOpacity(1)));
  mainWindow.on('blur', () => executeOnWindow(setTitleOpacity(0.5)));

  /**
   * Listen and respond to ipcRenderer events on the frontend.
   * @see `src\utils\services.js`
   */
  ipcMain.on('app-maximize', mainWindow.maximize);
  ipcMain.on('app-minimize', mainWindow.minimize);
  ipcMain.on('app-quit', () => shutdown(port));
  ipcMain.on('app-unmaximize', mainWindow.unmaximize);
  ipcMain.on('get-port-number', (event) => {
    event.returnValue = port;
  });
  ipcMain.on('app-restart', (_event, options) => {
    // Determine if debug or regular app is used
    const appPath = options.detached
      ? 'app.debug/app.debug.exe'
      : 'app/app.exe';

    // Determines if .py or .exe is used
    const script = isDevMode
      ? 'python app.py'
      : `start ./resources/${appPath}`;

    // Quit Flask, then restart in desired mode
    get(`http://localhost:${port}/quit`)
      .then(() => {
        spawn(`${script} ${port}`, options);

        if (options.detached) {
          mainWindow.webContents.openDevTools({ mode: 'undocked' });
        } else {
          mainWindow.webContents.closeDevTools();
        }
      })
      .catch(console.error);
  });

};

/**
 * @description - Creates loading window to show while build is created.
 * @memberof BrowserWindow
 */
const createLoadingWindow = () => {
  return new Promise((resolve, reject) => {
    const { loadingWindow } = browserWindows;

    const loaderConfig = {
      react: 'utilities/loaders/react/index.html',
      redux: 'utilities/loaders/redux/index.html'
    };

    try {
      loadingWindow.loadFile(path.join(__dirname, loaderConfig.react));

      loadingWindow.webContents.on('did-finish-load', () => {
        resolve(loadingWindow.show());
      });
    } catch (error) {
      reject(console.error(error));
    }
  });
};

/**
 * This method will be called when Electron has finished
 * initialization and is ready to create browser windows.
 * Some APIs can only be used after this event occurs.
 */
app.whenReady().then(async () => {
  /**
   * Method to set port in range of 3001-3999,
   * based on availability.
   */
  const port = await getPort({
    port: getPort.makeRange(3001, 3999)
  });

  /**
   * Assigns the main browser window on the
   * browserWindows object.
   */
  browserWindows.mainWindow = new BrowserWindow({
    frame: false,
    height: 370,
    maxHeight: 370,
    minHeight: 370,
    width: 675,
    minWidth: 675,
    maxWidth: 675,
    webPreferences: {
      contextIsolation: false,
      enableRemoteModule: true,
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  /**
   * If not using in production, use the loading window
   * and run Flask in shell.
   */
  if (isDevMode) {
    (browserWindows.loadingWindow = new BrowserWindow({ frame: false }));
    createLoadingWindow().then(() => createMainWindow(port));
    spawn(`python app.py ${port}`, {
      detached: true,
      shell: true,
      stdio: 'inherit'
    });
  } else {
    /**
     * If using in production, use the main window
     * and run bundled app.exe file.
     */
    createMainWindow(port);
    spawn(`start ./resources/app/app.exe ${port}`, {
      detached: false,
      shell: true,
      stdio: 'pipe'
    });
  }

  app.on('activate', () => {
    /**
     * On macOS it's common to re-create a window in the app when the
     * dock icon is clicked and there are no other windows open.
     */
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow(port);
  });

  /**
   * Ensures that only a single instance of the app
   * can run, this correlates with the "name" property
   * used in `package.json`.
   */
  const initialInstance = app.requestSingleInstanceLock();
  if (!initialInstance) app.quit();
  else {
    app.on('second-instance', () => {
      if (browserWindows.mainWindow?.isMinimized()) { browserWindows.mainWindow?.restore(); }
      browserWindows.mainWindow?.focus();
    });
  }

  /**
   * Quit when all windows are closed, except on macOS. There, it's common
   * for applications and their menu bar to stay active until the user quits
   * explicitly with Cmd + Q.
   */
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') shutdown(port);
  });
});
