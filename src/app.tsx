import './stylesheets/app.css'

import React, { FC } from 'react'
import SandwichDropzoneComponent from './components/sandwich-dropzone-component'
import { remote } from 'electron'

interface IAppProps {}

const App: FC<IAppProps> = () => {
  const appVersion = remote.app.getVersion()
  return (
    <div>
      <h1>Sandwich Beta (version {appVersion})</h1>
      <SandwichDropzoneComponent />
    </div>
  )
}

export default App
