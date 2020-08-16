import '../assets/stylesheets/app.scss'

import React, { FC } from 'react'
import DropzoneComponent from './dropzone-component'

const App: FC = () => (
  <>
    <div className="app__title">Sandwich Beta</div>
    <DropzoneComponent />
  </>
)

export default App
