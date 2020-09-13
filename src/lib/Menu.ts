import { app, Menu, MenuItem } from 'electron'

const menu = new Menu()
const menuItems = [
  new MenuItem({
    label: app.name,
    submenu: [
      { role: 'about' },
      { type: 'separator' },
      { role: 'quit' },
    ]
  }),
  new MenuItem({
    label: 'View',
    submenu: [
      { role: 'reload' },
      { role: 'forceReload' },
      { role: 'toggleDevTools' },
    ]
  })
]

for (const menuItem of menuItems) {
  menu.append(menuItem)
}

export default menu
