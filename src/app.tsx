import './stylesheets/app.css';

import React from 'react';
import { SandwichDropzoneComponent, IDropzoneProps, IFileWithMeta } from './components/sandwich-dropzone-component';
import { SandwichSortableListComponent, arrayMove } from './components/sandwich-sortable-list-component';
import { createPDF } from './lib/pdf-helpers';

interface AppProps {}

interface AppState {
  files: IFileWithMeta[]
}

class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
    this.state = {
      files: []
    };
  }

  onSortEnd = (sort: { oldIndex: number, newIndex: number }): void => {
    this.setState({
      files: arrayMove(this.state.files, sort.oldIndex, sort.newIndex)
    });
  }

  handleChangeStatus: IDropzoneProps['onChangeStatus'] = (file, status) => {
    if (status === 'done') {
      this.setState({
        files: this.state.files.concat(file)
      });
      console.log(this.state.files);
    } else if (status === 'removed') {
      this.setState({
        files: this.state.files.filter(otherFile =>
          otherFile.meta.id !== file.meta.id
        )
      });
    }
  }

  onButtonClick = (): void => {
    createPDF(this.state.files);
  }

  render(): React.ReactElement {
    return (
      <div>
        <h1>Sandwich Beta</h1>
        <SandwichDropzoneComponent onChangeStatus={this.handleChangeStatus} />
        <SandwichSortableListComponent items={this.state.files} onSortEnd={this.onSortEnd} />
        <button onClick={this.onButtonClick}>Sandwich PDF</button>
      </div>
    );
  }
}

export default App;
