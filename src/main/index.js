import { app, shell, BrowserWindow, ipcMain, dialog } from 'electron'
import path, { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import { initGlobalErrorHandlers } from './errorHandler'
import ipcHandler from './ipcHandler.js'
import updater from 'electron-updater' // ✅
import dotenv from 'dotenv'

dotenv.config()
// Define the update server URL (this can be GitHub releases, or your custom server)
const feedURL =
  'https://github.com/mzool/warehouse-manager/releases/download/1.0.1/Warehouse.Manager.Setup.1.0.1.exe'

// Function to handle updates
function checkForUpdates() {
  updater.autoUpdater.setFeedURL({
    provider: 'github',
    url: feedURL,
    owner: 'mzool', // GitHub repository owner (your username or org)
    repo: 'warehouse-manager', // GitHub repository name,
    //token: process.env.auth_token
  })

  // Start checking for updates
  updater.autoUpdater.checkForUpdates()

  updater.autoUpdater.on('update-available', () => {
    console.log('Update available')
    // Show a notification to inform the user that an update is available
    dialog.showMessageBox({
      type: 'info',
      title: 'Update Available',
      message: 'A new version is available. The app will automatically download the update.',
      buttons: ['OK']
    })
  })

  updater.autoUpdater.on('update-downloaded', () => {
    console.log('Update downloaded')
    // Ask user to restart the app
    dialog
      .showMessageBox({
        type: 'info',
        buttons: ['Restart', 'Later'],
        title: 'Update Ready',
        message:
          'A new version has been downloaded. Do you want to restart now to apply the update?'
      })
      .then((result) => {
        if (result.response === 0) {
          // Restart the app and apply the update
          updater.quitAndInstall()
        }
      })
  })

  updater.autoUpdater.on('error', (err) => {
    console.error('Update error:', err)
    dialog.showMessageBox({
      type: 'error',
      title: 'Update Failed',
      message: `There was an error checking for updates: ${err.message}`,
      buttons: ['OK']
    })
  })
}

// Create the main browser window
function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 750,
    show: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: join(__dirname, '../preload/index.mjs'),
      sandbox: false
    },
    icon: path.join(__dirname, '../../resources/icon.png')
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer based on electron-vite CLI
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// Register IPC handlers from ipcHandler
for (const [event, handler] of Object.entries(ipcHandler)) {
  ipcMain.handle(event, handler)
}

// Initialize global error handlers
initGlobalErrorHandlers()

// When Electron has finished initialization, create the browser window and set up IPC handlers
app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })

  // Start checking for updates after the app is ready
  checkForUpdates()
})

// Quit when all windows are closed, except on macOS.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
