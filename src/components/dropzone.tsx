import 'dropzone/dist/min/dropzone.min.css';
import 'react-dropzone-component/styles/filepicker.css';

import React from 'react';
import { DropzoneComponent, DropzoneComponentProps } from 'react-dropzone-component';

export interface DropzoneFile extends File {
  dataURL: string,
  upload: {
    uuid: string
  }
}

export class Dropzone extends React.Component<DropzoneComponentProps, DropzoneComponentProps> {
  constructor(props: DropzoneComponentProps) {
    super(props);
    this.state = {
      config: {
        postUrl: 'no-url'
      },
      djsConfig: {
        autoProcessQueue: false
      }
    }
  }

  render(): React.ReactElement {
    return (
      <DropzoneComponent
        config={this.state.config}
        djsConfig={this.state.djsConfig}
        eventHandlers={this.props.eventHandlers} />
    );
  }
}
