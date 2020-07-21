import './stylesheets/app.css'

import React, { Component, ReactElement } from 'react'
import SandwichDropzoneComponent from './components/sandwich-dropzone-component'

export default class App extends Component {
  render(): ReactElement {
    return (
      <div>
        <h1>Sandwich Beta</h1>
        <SandwichDropzoneComponent />
      </div>
    );
  }
}
