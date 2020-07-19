import './stylesheets/app.css';

import React from 'react';
import { Dropzone } from './components/dropzone';
import { SortableList } from './components/sortable-list';

export class App extends React.Component {
  render(): React.ReactElement {
    return (
      <div>
        <h1>Sandwich Beta</h1>

        <Dropzone />

        <h2>Sort</h2>
        <SortableList />

        <button>Sandwich</button>
      </div>
    );
  }
}
