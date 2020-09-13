declare const MAIN_WINDOW_WEBPACK_ENTRY: string

import { app, BrowserWindow, Menu } from 'electron'
import { isDev } from './lib/is'
import menu from './menu'

const createBrowserWindow = () => {
  const mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
    maximizable: false,
    resizable: isDev,
    webPreferences: {
      enableRemoteModule: true,
      nodeIntegration: true
    }
  });

  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  Menu.setApplicationMenu(menu)

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }
}

const handleReady = () => createBrowserWindow()

const handleActivate = () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createBrowserWindow()
  }
}

const handleWindowAllClosed = () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
}

if (require('electron-squirrel-startup')) {
  app.quit()
}

app.setAboutPanelOptions({
  applicationName: app.getName(),
  applicationVersion: app.getVersion(),
  version: '',
  copyright: 'Copyright © 2020 Mystery Bodega LLC'
})

app.on('ready', handleReady)
   .on('activate', handleActivate)
   .on('window-all-closed', handleWindowAllClosed)
