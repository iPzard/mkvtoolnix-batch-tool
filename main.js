const { get } = require('axios');
const { spawn } = require('child_process');
const path = require('path');

// Modules to help control application life-cycle
const { app, BrowserWindow, ipcMain } = require('electron');
const getPort = require('get-port');
const isDevMode = require('electron-is-dev');

const shutdown = (port) => {
  get(`http://localhost:${port}/quit`)
    .then(() => app.quit())
    .catch(() => app.quit());
};

// Browser window configurations
const browserWindows = {};

const createMainWindow = (port) => {
  const { loadingWindow, mainWindow } = browserWindows;

  // If in developer mode, show a loading window while
  // the app and developer server compile.
  if(isDevMode) {
    mainWindow.hide();
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.webContents.on('dom-ready', () => {
      loadingWindow.destroy();
      mainWindow.show();
      mainWindow.webContents.openDevTools(); // Open the DevTools.
    });
  }

  // Use build/index.html for production release
  else mainWindow.loadFile(path.join(__dirname, 'build/index.html'));

  // Set opacity for title on window blur & focus
  const setTitleOpacity = (value) => `
    ['electron-window-title-icon', 'electron-window-title-text', 'electron-window-title-buttons']
    .forEach((id) => document.getElementById(id).style.opacity = ${value});
  `;

  const executeOnWindow = (command) => mainWindow.webContents.executeJavaScript(command);
  mainWindow.on('focus', () => executeOnWindow(setTitleOpacity(1)));
  mainWindow.on('blur', () => executeOnWindow(setTitleOpacity(0.5)));

  // Send window control event listeners to front end
  ipcMain.on('app-maximize', () => mainWindow.maximize());
  ipcMain.on('app-minimize', () => mainWindow.minimize());
  ipcMain.on('app-quit', () => shutdown(port));
  ipcMain.on('app-unmaximize', () => mainWindow.unmaximize());
  ipcMain.on('get-port-number', (event) => (event.returnValue = port));
};

// Loading window to show while Dev Build is being created
const createLoadingWindow = () => {
  return new Promise((resolve, reject) => {
    const { loadingWindow } = browserWindows;

    try {
      loadingWindow.loadFile(path.join(__dirname, 'utilities/loading/index.html'));
      loadingWindow.webContents.on('did-finish-load', () => {
        resolve(loadingWindow.show());
      });
    } catch(error) {
      reject((error) => console.error(error));
    }
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {

  // Method to set port in range of 3001-3999, based on availability
  const port = await getPort({
    port: getPort.makeRange(3001, 3999)
  });

  // Initialize main browser window
  browserWindows.mainWindow = new BrowserWindow({
    frame: false,
    height: 370,
    maxHeight: 370,
    minHeight: 370,
    width: 675,
    minWidth: 675,
    maxWidth: 675,
    webPreferences: {
      enableRemoteModule: true,
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  // If dev mode, use loading window and run Flask in shell
  if(isDevMode) {
    browserWindows.loadingWindow = new BrowserWindow({ frame: false }),
    createLoadingWindow().then(()=> createMainWindow(port));
    spawn(`python app.py ${port}`, { detached: true, shell: true, stdio: 'inherit' });
  }

  // Connect to Python micro-services for production.
  else {
    createMainWindow(port);
    spawn(`start ./resources/app/app.exe ${port}`, { detached: false, shell: true, stdio: 'pipe' });
  }

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow(port);
  });

  // Feature to ensure single app instance
  const initialInstance = app.requestSingleInstanceLock();
  if (!initialInstance) app.quit();
  else {
    app.on('second-instance', () => {
      if(browserWindows.mainWindow?.isMinimized()) browserWindows.mainWindow?.restore();
      browserWindows.mainWindow?.focus();
    });
  }

  // Quit when all windows are closed, except on macOS. There, it's common
  // for applications and their menu bar to stay active until the user quits
  // explicitly with Cmd + Q.
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') shutdown(port);
  });
});
