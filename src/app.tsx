import './stylesheets/app.css'

import React, { FC } from 'react'
import SandwichDropzoneComponent from './components/sandwich-dropzone-component'

interface IAppProps {}

const App: FC<IAppProps> = () => {
  return (
    <div>
      <h1>Sandwich Beta</h1>
      <SandwichDropzoneComponent />
    </div>
  )
}

export default  App
