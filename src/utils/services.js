import { socket } from 'utils/requests';

// Electron Inter Process Communication and dialog
const { ipcRenderer, remote } = window.require('electron');
const { dialog } = remote;

/**
 * @namespace Services
 * @description - Methods from Electron Inter Process Communication.
 * @property {function} maximize - Function to maximize the screen size of the program.
 * @property {function} minimize - Function to minimize the screen size of the program.
 * @property {function} quit - Function to close and exit the program.
 * @property {function} unmaximize - Function to contract (unmaximize) the screen size of the program.
 * @property {function} restart - Function to restart the app with the given spawn options.
 */
export const app = {
  maximize: () => ipcRenderer.send('app-maximize'),
  minimize: () => ipcRenderer.send('app-minimize'),
  quit: () => ipcRenderer.send('app-quit'),
  reconnectionDelay: socket.io.reconnectionDelay(),
  restart: (options) => {
    socket.once('disconnect', () => {
      setTimeout(() => {
        ipcRenderer.send('app-restart', options);
        setTimeout(() => {
          socket.connect();
        }, app.reconnectionDelay);
      }, app.reconnectionDelay);
    });

    socket.disconnect();
  },
  unmaximize: () => ipcRenderer.send('app-unmaximize')
};

/**
 * @description - Function to get a list of files that a user wants to have renamed, this
 * also returns the folder path and name the user has selected.
 * @return - User selected folder path.
 * @memberof Services
 */
export const getDirectory = async (callback) => {
  dialog
    .showOpenDialog({ properties: ['openDirectory'] })
    .then((response) => {
      return response.canceled
        ? null
        : callback(String.raw`${response.filePaths[0]}`);
    })
    .catch(console.error);
};
