"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("ipcRenderer", {
  on(...args) {
    const [channel, listener] = args;
    return electron.ipcRenderer.on(channel, (event, ...args2) => listener(event, ...args2));
  },
  off(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.off(channel, ...omit);
  },
  send(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.send(channel, ...omit);
  },
  invoke(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.invoke(channel, ...omit);
  }
  // You can expose other APTs you need here.
  // ...
});
electron.contextBridge.exposeInMainWorld("fileAPI", {
  openFile: () => electron.ipcRenderer.invoke("open-file-dialog"),
  saveFile: (data) => electron.ipcRenderer.invoke("save-file-dialog", data),
  savePNG: (buffer) => electron.ipcRenderer.invoke("save-png-dialog", buffer),
  saveSVG: (svgString) => electron.ipcRenderer.invoke("save-svg-dialog", svgString)
});
