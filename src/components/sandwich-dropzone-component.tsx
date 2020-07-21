import 'react-dropzone-uploader/dist/styles.css'

import React, { Component, FC, ReactElement } from 'react';
import Dropzone, { IDropzoneProps, IFileWithMeta, ILayoutProps } from 'react-dropzone-uploader'
import SandwichSortableGridComponent, { arrayMove } from './sandwich-sortable-grid-component'
import { createPDF } from '../lib/pdf-helpers'

export { IFileWithMeta } from 'react-dropzone-uploader'

export interface ISandwichDropzoneProps {}

export interface ISandwichDropzoneState {
  files: IFileWithMeta[]
}

export default class SandwichDropzoneComponent extends Component<ISandwichDropzoneProps, ISandwichDropzoneState> {
  constructor(props: ISandwichDropzoneProps) {
    super(props)
    this.state = {
      files: []
    }
  }

  render(): ReactElement {
    return (
      <Dropzone
        accept="image/jpeg,image/png,.pdf"
        onChangeStatus={this.handleChangeStatus}
        LayoutComponent={this.Layout}
      />
    )
  }

  handleChangeStatus: IDropzoneProps['onChangeStatus'] = (file, status) => {
    if (status === 'done') {
      this.setState({
        files: this.state.files.concat(file)
      })
    } else if (status === 'removed') {
      this.setState({
        files: this.state.files.filter(otherFile => otherFile.meta.id !== file.meta.id)
      })
    }
  }

  handleSortEnd = (sort: { oldIndex: number, newIndex: number }): void => {
    this.setState({
      files: arrayMove(this.state.files, sort.oldIndex, sort.newIndex)
    })
  }

  handleClick = (): void => {
    createPDF(this.state.files)
  }

  Layout: FC<ILayoutProps> = ({ input, dropzoneProps, files }) => {
    return (
      <div className="sandwich-dropzone-component">
        <div {...dropzoneProps}>
          <SandwichSortableGridComponent
            items={this.state.files}
            onSortEnd={this.handleSortEnd} />
          {input}
        </div>
        <button onClick={this.handleClick}>Sandwich PDF</button>
      </div>
    )
  }
}
