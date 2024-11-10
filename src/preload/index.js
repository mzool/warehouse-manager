import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  getMaterials: () => ipcRenderer.invoke('get-materials'),
  addMaterials: (materials) => ipcRenderer.invoke('add-materials', materials),
  updateMaterial: (material) => ipcRenderer.invoke('update-material', material),
  getTables: () => ipcRenderer.invoke('get-tables'),
  removeMaterial: (id) => ipcRenderer.invoke('remove-material', id)
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.api = api
}
