import { app } from 'electron'

export const isDev = true // !app.isPackaged
export const isMac = process.platform === 'darwin'
