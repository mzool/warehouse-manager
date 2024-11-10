import { app, dialog } from 'electron' // Import ipcMain

function showErrorDialog(error) {
  dialog
    .showMessageBox({
      type: 'error',
      buttons: ['Restart', 'Close App'],
      defaultId: 0,
      title: 'Application Error',
      message: 'An unexpected error occurred.',
      detail: error.message || error.toString()
    })
    .then(({ response }) => {
      if (response === 0) {
        // Restart the application
        app.relaunch()
        app.exit(0)
      } else if (response === 1) {
        // Close the app
        app.exit(0)
      }
    })
}

// Attach global error handlers
function initGlobalErrorHandlers() {
  process.on('uncaughtException', (error) => {
    console.error('Unhandled Error:', error)
    showErrorDialog(error)
  })

  process.on('unhandledRejection', (reason) => {
    console.error('Unhandled Rejection:', reason)
    showErrorDialog(reason)
  })
}

export { showErrorDialog, initGlobalErrorHandlers }
