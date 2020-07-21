import 'react-dropzone-uploader/dist/styles.css'

import React, { useState, FunctionComponent } from 'react';
import Dropzone, { IDropzoneProps, IFileWithMeta, ILayoutProps } from 'react-dropzone-uploader'
import SandwichSortableGridComponent, { arrayMove } from './sandwich-sortable-grid-component'
import { createPDF } from '../lib/pdf-helpers'

interface ISandwichDropzoneProps {}

interface ISandwichDropzoneState {
  files: IFileWithMeta[]
}

const SandwichDropzoneComponent: FunctionComponent<ISandwichDropzoneProps> = () => {
  const [state, setState] = useState<ISandwichDropzoneState>({ files: [] });

  const handleChangeStatus: IDropzoneProps['onChangeStatus'] = (file, status) => {
    if (status === 'done') {
      setState({
        files: state.files.concat(file)
      })
    } else if (status === 'removed') {
      setState({
        files: state.files.filter(otherFile => otherFile.meta.id !== file.meta.id)
      })
    }
  }

  const handleSortEnd = (sort: { oldIndex: number, newIndex: number }): void => {
    setState({
      files: arrayMove(state.files, sort.oldIndex, sort.newIndex)
    })
  }

  const handleClick = (): void => {
    createPDF(state.files)
  }

  const LayoutComponent: FunctionComponent<ILayoutProps> = ({ input, dropzoneProps, files }) => {
    return (
      <div className="sandwich-dropzone-component">
        <div {...dropzoneProps}>
          <SandwichSortableGridComponent
            items={state.files}
            onSortEnd={handleSortEnd} />
          {input}
        </div>
        <button onClick={handleClick}>Export PDF</button>
      </div>
    )
  }

  return (
    <Dropzone
      accept="image/jpeg,image/png,.pdf"
      onChangeStatus={handleChangeStatus}
      LayoutComponent={LayoutComponent}
    />
  )
}

export default SandwichDropzoneComponent
export { IFileWithMeta } from 'react-dropzone-uploader'
