import './stylesheets/app.css';

import React from 'react';
import { Dropzone, DropzoneFile } from './components/dropzone';
import { SortableList, SortEndHandler, arrayMove } from './components/sortable-list';

interface AppProps {}
interface AppState {
  files: DropzoneFile[]
}

class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
    this.state = {
      files: []
    };
  }

  onSortEnd: SortEndHandler = (sort) => {
    this.setState({
      files: arrayMove(this.state.files, sort.oldIndex, sort.newIndex)
    });
  };


  render(): React.ReactElement {
    const that = this;
    const eventHandlers = {
      addedfile(file: DropzoneFile) {
        that.setState({ files: this.files });
      }
    };

    return (
      <div>
        <h1>Sandwich Beta</h1>
        <Dropzone eventHandlers={eventHandlers} />
        <h2>Sort</h2>
        <SortableList items={this.state.files} onSortEnd={this.onSortEnd} />
        <button>Sandwich PDF</button>
      </div>
    );
  }
}

export default App;
