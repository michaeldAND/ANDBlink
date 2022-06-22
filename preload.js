const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld(
  'electron',
  {
    sendSettings: (workTime, breakTime, active) => {
      console.log('settings values in preload.js: ', workTime, breakTime, active);
      ipcRenderer.send('send-settings', { workTime, breakTime, active });
    },
  },
);
