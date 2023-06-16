const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld("ipcRenderer", {
  send: (channel, ...args) => ipcRenderer.send(channel, ...args),
  on: (channel, func) => ipcRenderer.on (channel, func),
  invoke: (channel, ...args) =>
    new Promise((resolve, reject) => {
      ipcRenderer.invoke(channel, ...args)
        .then(resolve)
        .catch(reject);
    }), 
})

contextBridge.exposeInMainWorld('versions', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron
})