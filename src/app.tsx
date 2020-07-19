import React from 'react';
import { DropzoneComponent } from 'react-dropzone-component';

export class App extends React.Component {
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
      <section>
        <h1>Sandwich Beta</h1>
        <DropzoneComponent
          config={config}
          djsConfig={djsConfig}
          eventHandlers={eventHandlers}/>
      </section>
    );
  }
}
