import { app, Menu, MenuItem } from 'electron'

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

export default menu
