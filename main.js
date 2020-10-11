// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain } = require('electron');
const { spawn } = require('child_process');
const { get } = require('axios');
const getPort = require('get-port');
const path = require('path');

// Dynamically set the port number to an open port within the range of 3000-3999
// This way if a port is in use it will just go to the next.
let port;
(async () => {
  port = await getPort({port: getPort.makeRange(3000, 3999)});
  ipcMain.on('get-port-number', (event, arg) => event.returnValue = port);
})();

const shutdown = (port)=> {
  get(`http://localhost:${port}/quit`)
    .then(() => app.quit())
    .catch(()=> app.quit());
};

function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    frame: false,
    height: 288,
    maxHeight: 288,
    minHeight: 288,
    width: 675,
    minWidth: 675,
    maxWidth: 675,
    webPreferences: {
      enableRemoteModule: true,
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'build/index.html'));

  // Open the DevTools.
   mainWindow.webContents.openDevTools();

  // Set opacity for title on window blur & focus
  const setTitleOpacity = value => `
    ['electron-window-title-icon', 'electron-window-title-text', 'electron-window-title-buttons']
    .forEach((id) => document.getElementById(id).style.opacity = ${value});
  `;

   const executeOnWindow = command => mainWindow.webContents.executeJavaScript(command);
   mainWindow.on('focus', ()=> executeOnWindow(setTitleOpacity(1)));
   mainWindow.on('blur',  ()=> executeOnWindow(setTitleOpacity(.5)));

   // Send window control event listeners to front end
   ipcMain.on('app-maximize', (event, arg) => mainWindow.maximize());
   ipcMain.on('app-minimize', (event, arg) => mainWindow.minimize());
   ipcMain.on('app-quit', (event, arg) => shutdown(port));
   ipcMain.on('app-unmaximize', (event, arg) => mainWindow.unmaximize());
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  })


  // Connect to Python micro-services..
  spawn(`start ./resources/app/app.exe ${port}`, { detached: false, shell: true, stdio: 'pipe' });

  // Run Flask in a shell for dev, debugging or testing
  //spawn(`flask run -p ${port}`, { detached: true, shell: true, stdio: 'inherit' });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin')
    shutdown();

});
