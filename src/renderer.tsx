import { remote } from 'electron'
import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/app'

const { app } = remote

ReactDOM.render(
  <App name={app.getName()} version={app.getVersion()} />,
  document.getElementById('root')
)
