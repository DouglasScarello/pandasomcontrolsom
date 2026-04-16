const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    getStatus: () => ipcRenderer.invoke('get-status'),
    volumeUp: () => ipcRenderer.send('volume-up'),
    volumeDown: () => ipcRenderer.send('volume-down'),
    toggleMute: () => ipcRenderer.send('toggle-mute'),
    closeApp: () => ipcRenderer.send('close-app'),
});
