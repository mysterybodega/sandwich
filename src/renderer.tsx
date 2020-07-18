import 'dropzone/dist/min/dropzone.min.css';
import 'react-dropzone-component/styles/filepicker.css';
import './index.css';

import React from 'react';
import ReactDOM from 'react-dom';
import { DropzoneComponent } from 'react-dropzone-component';

const componentConfig = {
  iconFiletypes: ['.jpg', '.png', '.pdf'],
  showFiletypeIcon: true,
  postUrl: 'no-url'
};
const djsConfig = { autoProcessQueue: false };
const eventHandlers = { addedfile: console.log };

ReactDOM.render(
  <section>
    <h1>Sandwich Beta</h1>
    <DropzoneComponent config={componentConfig} djsConfig={djsConfig} eventHandlers={eventHandlers}/>
  </section>,
  document.getElementById('root')
);
