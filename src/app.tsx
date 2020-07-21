import './stylesheets/app.css'

import React, { FunctionComponent } from 'react'
import SandwichDropzoneComponent from './components/sandwich-dropzone-component'

interface IAppProps {}

const App: FunctionComponent<IAppProps> = () => {
  return (
    <div>
      <h1>Sandwich Beta</h1>
      <SandwichDropzoneComponent />
    </div>
  )
}

export default  App
