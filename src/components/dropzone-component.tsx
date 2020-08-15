import 'react-dropzone-uploader/dist/styles.css'

import Dropzone, { IDropzoneProps, IFileWithMeta, ILayoutProps } from 'react-dropzone-uploader'
import React, { useState, FC } from 'react'
import SortableListComponent, { Axis, arrayMove } from './sortable-list-component'
import fs from 'fs'
import { createPDF, createPDFPreviewUrl } from '../lib/pdf-helpers'
import { remote } from 'electron'
import { FileType } from '../lib/file-type'

interface IDropzoneComponentState {
  axis: Axis,
  files: IFileWithMeta[]
}

const DropzoneComponent: FC = () => {
  const [state, setState] = useState<IDropzoneComponentState>({
    axis: 'xy',
    files: []
  })

  const handleChangeStatus: IDropzoneProps['onChangeStatus'] = (file, status) => {
    if (status === 'done') {
      if (file.file.type === FileType.PDF) {
        createPDFPreviewUrl(file.file).then((previewUrl) => {
          file.meta.previewUrl = previewUrl

          setState({
            axis: state.axis,
            files: state.files.concat(file)
          })
        })
      } else {
        setState({
          axis: state.axis,
          files: state.files.concat(file)
        })
      }
    } else if (status === 'removed') {
      setState({
        axis: state.axis,
        files: state.files.filter(otherFile => otherFile.meta.id !== file.meta.id)
      })
    }
  }

  const handleSortEnd = (sort: { oldIndex: number, newIndex: number }): void => {
    setState({
      axis: state.axis,
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

  const toggleAxis = () => {
    let axis: Axis;

    if (state.axis === 'xy') {
      axis = 'y'
    } else if (state.axis === 'y') {
      axis = 'xy'
    }

    setState({
      axis,
      files: state.files
    })
  }

  const LayoutComponent: FC<ILayoutProps> = ({ input, dropzoneProps, files }) => {
    const className = `
      dropzone-component
      dropzone-component--axis--${state.axis}
    `
    const axisButtonText = state.axis === 'xy' ? 'Show List View' : 'Show Grid View'

    return (
      <div className={className}>
        <button onClick={toggleAxis}>{axisButtonText}</button>
        <div {...dropzoneProps}>
          <SortableListComponent axis={state.axis} items={state.files} onSortEnd={handleSortEnd} />
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

export default DropzoneComponent
export { IFileWithMeta } from 'react-dropzone-uploader'
