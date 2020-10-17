// Electron Inter Process Communication and dialog
const { ipcRenderer } = window.require('electron');

// Dynamically generated TCP (open) port between 3000-3999
const port = ipcRenderer.sendSync('get-port-number');

/**
 * @namespace Requests
 * @description - Helper functions for network requests (e.g., get, post, put, delete, etc..)
 */

/**
* @description - Helper GET method for sending requests to and from the Python/Flask services.
* @param {string} url - URL route of the Python/Flask service you want to use.
* @param {function} callback - Callback function which uses the returned data as an argument.
* @param {function} errorCallback - Callback function to use if there's an error.
* @return response data from Python/Flask service.
* @memberof Requests
*/
export const get = (route, callback, errorCallback) => {
  fetch(`http://localhost:${port}/${route}`)
    .then((response) => response.json())
    .then((response) => callback(response))
    .catch((error) => errorCallback(error));
};


/**
* @description - Helper POST method for sending requests to and from the Python/Flask services.
* @param {string}  body - JSON.stringified request body of data that you want to pass.
* @param {string}  route - URL route of the Python/Flask service you want to use.
* @param {function}  callback - optional callback function to be invoked if provided.
* @param {function} errorCallback - Callback function to use if there's an error.
* @return response data from Python/Flask service.
* @memberof Requests
*/
export const post = (body, route, callback, errorCallback) => {
  fetch(`http://localhost:${port}/${route}`, {
    body,
    method: 'POST',
    headers: { 'Content-type': 'application/json' }
  })
  .then((response) => response.json())
  .then(response => callback(response))
  .catch((error) => errorCallback(error));
};