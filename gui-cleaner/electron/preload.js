const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  getStats: () => ipcRenderer.invoke('get-stats'),
  cleanFolder: (path) => ipcRenderer.invoke('clean-folder', path),
  runPythonScript: () => ipcRenderer.invoke('run-python-script'),
  checkAdmin: () => ipcRenderer.invoke('check-admin'),
});
