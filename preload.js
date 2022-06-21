const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld(
  'electron',
  {
    doThing: () => {
      console.log('yo');
      ipcRenderer.send('do-a-thing', 'AREGUMENTS');
    },
  },
);
