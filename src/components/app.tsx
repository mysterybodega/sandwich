import '../assets/stylesheets/app.css'

import React, { FC } from 'react'
import DropzoneComponent from './dropzone-component'

interface IAppProps {}

const App: FC<IAppProps> = (props) => (
  <div>
    <h1>Sandwich Beta</h1>
    <DropzoneComponent />
  </div>
)

export default App
