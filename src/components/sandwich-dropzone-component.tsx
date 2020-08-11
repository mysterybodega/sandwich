import 'react-dropzone-uploader/dist/styles.css'

import React, { useState, FC } from 'react'
import Dropzone, { IDropzoneProps, IFileWithMeta, ILayoutProps } from 'react-dropzone-uploader'
import SandwichSortableGridComponent, { arrayMove } from './sandwich-sortable-grid-component'
import { createPDF } from '../lib/pdf-helpers'
import { remote } from 'electron'
import fs from 'fs'
import { promisify } from 'util'

interface ISandwichDropzoneProps {}

interface ISandwichDropzoneState {
  files: IFileWithMeta[]
}

const SandwichDropzoneComponent: FC<ISandwichDropzoneProps> = () => {
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

  const handleClick = async (): Promise<void> => {
    const { filePath } = await remote.dialog.showSaveDialog(
      remote.getCurrentWindow(),
      {
        defaultPath : 'sandwich.pdf',
        buttonLabel : 'Save PDF',
        filters: [{ name: 'PDFs', extensions: ['pdf'] }]
      }
    )

    if (filePath) {
      const pdf = await createPDF(state.files.map(({ file }) => file))

      fs.writeFile(filePath, pdf, async (err) => {
        const messageBox = {
          type: '',
          message: '',
        }

        if (err) {
          messageBox.type = 'error'
          messageBox.message = err.message
        } else {
          messageBox.type = 'info'
          messageBox.message = 'PDF saved.'
        }

        await remote.dialog.showMessageBox(
          remote.getCurrentWindow(),
          messageBox
        )
      });
    }
  }

  const LayoutComponent: FC<ILayoutProps> = ({ input, dropzoneProps, files }) => {
    return (
      <div className="sandwich-dropzone-component">
        <div {...dropzoneProps}>
          <SandwichSortableGridComponent
            items={state.files}
            onSortEnd={handleSortEnd} />
          {input}
        </div>
        <button onClick={handleClick}>Save PDF</button>
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
