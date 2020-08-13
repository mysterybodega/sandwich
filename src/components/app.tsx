import '../stylesheets/app.css'

import React, { FC } from 'react'
import DropzoneComponent from './dropzone-component'

interface IAppProps {
  name: string,
  version: string,
}

const App: FC<IAppProps> = (props) => (
  <div>
    <h1>{props.name} (v{props.version})</h1>
    <DropzoneComponent />
  </div>
)

export default App
