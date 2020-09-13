import { app } from 'electron'

export const isDev = !app.isPackaged
export const isMac = process.platform === 'darwin'
