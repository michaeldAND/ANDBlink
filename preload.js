const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld(
  'electron',
  {
    sendSettings: (settings) => {
      ipcRenderer.send('send-settings', settings);
    },
    recieveSettings: (callback) => {
      ipcRenderer.on('recieve-settings', (event, settings) => callback(settings));
    },
    handshake: () => {
      ipcRenderer.send('handshake');
    },
    restoreDefaults: () => {
      ipcRenderer.send('restore-defaults');
    },
  },
);
