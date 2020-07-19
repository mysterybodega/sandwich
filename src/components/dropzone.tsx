import 'dropzone/dist/min/dropzone.min.css';
import 'react-dropzone-component/styles/filepicker.css';

import React from 'react';
import { DropzoneComponent } from 'react-dropzone-component';

export class Dropzone extends React.Component {
  render(): React.ReactElement {
    const config = {
      iconFiletypes: ['.jpg', '.png', '.pdf'],
      showFiletypeIcon: true,
      postUrl: 'no-url'
    };
    const djsConfig = {
      autoProcessQueue: false
    };
    const eventHandlers = {
      addedfile: console.log
    };

    return (
      <DropzoneComponent config={config} djsConfig={djsConfig} eventHandlers={eventHandlers} />
    );
  }
}
