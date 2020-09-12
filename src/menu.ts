import { app, Menu, MenuItem } from 'electron'

const isDev = !app.isPackaged
const isMac = process.platform === 'darwin'
const menu = new Menu()

menu.append(
  new MenuItem({
    label: app.name,
    submenu: [
      { role: 'about' },
      { type: 'separator' },
      { role: 'quit' },
    ]
  })
)

menu.append(
  new MenuItem({
    label: 'View',
    submenu: [
      { role: 'reload' },
      { role: 'forceReload' },
      { role: 'toggleDevTools' },
    ]
  })
)

export default menu
