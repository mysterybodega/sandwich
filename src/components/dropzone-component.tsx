import React, { useEffect, useState, FC } from 'react'

import Dropzone, {
  IDropzoneProps,
  IFileWithMeta,
  ILayoutProps
} from 'react-dropzone-uploader'

import {
  arrayMove,
  SortableContainer,
  SortableElement
} from 'react-sortable-hoc'

import classNames from 'classnames'
import filesize from 'filesize'
import fs from 'fs'
import { remote } from 'electron'

import { FileType } from '../lib/file-type'
import { createPDF, createPDFPreviewUrl } from '../lib/pdf-helpers'

type Axis = 'y' | 'xy'

const cn = (...elements: string[]) => {
  const blockClassName = 'dropzone-component'
  if (elements.length === 0) {
    return blockClassName
  }
  return [blockClassName].concat(elements).join('__')
}

interface IDropzoneComponentState {
  axis: Axis,
  files: IFileWithMeta[]
}

const DropzoneComponent: FC = () => {
  const [state, setState] = useState<IDropzoneComponentState>({
    axis: 'xy',
    files: []
  })
  const setAxis = (axis: Axis) => setState({ axis, files: state.files })
  const setFiles = (files: IFileWithMeta[]) => setState({ files, axis: state.axis })

  const handleChangeStatus: IDropzoneProps['onChangeStatus'] = (file, status) => {
    if (status === 'done') {
      if (file.file.type === FileType.PDF) {
        createPDFPreviewUrl(file.file).then((previewUrl) => {
          file.meta.previewUrl = previewUrl

          setFiles(state.files.concat(file))
        })
      } else {
        setFiles(state.files.concat(file))
      }
    } else if (status === 'removed') {
      setFiles(
        state.files.filter(otherFile => otherFile.meta.id !== file.meta.id)
      )
    }
  }

  const handleSortEnd = (sort: { oldIndex: number, newIndex: number }): void => {
    setFiles(arrayMove(state.files, sort.oldIndex, sort.newIndex))
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

  const LayoutComponent: FC<ILayoutProps> = ({ input, dropzoneProps }) => {
    return (
      <div className={cn()}>
        <div className={cn('header')}>
          <div className={cn('header', 'btns')}>
            <a className={
              classNames(cn('header', 'btn'), {
                [cn('header', 'btn--active')]: state.axis === 'xy'
              })
            }
               onClick={() => setAxis('xy')}>
              <i className="fa fa-lg fa-th-large"></i>
            </a>

            <a className={
              classNames(cn('header', 'btn'), {
                [cn('header', 'btn--active')]: state.axis === 'y'
              })
            }
               onClick={() => setAxis('y')}>
              <i className="fa fa-lg fa-bars"></i>
            </a>
          </div>
        </div>

        <div {...dropzoneProps}>
          <SortableListComponent
            axis={state.axis}
            items={state.files}
            onSortEnd={handleSortEnd} />
          {input}
        </div>

        <div className={cn('footer')}>
          <button onClick={handleClick}>Make PDF</button>
        </div>
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

interface ISortableListProps {
  axis: Axis,
  items: IFileWithMeta[]
  onSortEnd: (sort: { oldIndex: number, newIndex: number }) => void
}

const SortableListComponent: FC<ISortableListProps> = ({ axis, items, onSortEnd }) => {
  const SortableContainerComponent = SortableContainer((props: ISortableListProps) => {
    return (
      <ul className={classNames(cn('files'), cn(`files--axis-${axis}`))}>
        {props.items.map((file, index) => (
          <SortableElementComponent
            key={file.meta.id}
            index={index}
            sortIndex={index}
            value={file} />
        ))}
      </ul>
    )
  })

  const SortableElementComponent = SortableElement((item: { value: IFileWithMeta , sortIndex: number }) => {
    const elem = item.value
    const file = item.value.file
    const meta = item.value.meta
    const sortIndex = item.sortIndex

    let preview;

    if (file.type === FileType.PDF) {
      preview = <object type={FileType.PDF} data={meta.previewUrl} />
    } else {
      preview = <img src={meta.previewUrl} />
    }

    return (
      <li className={classNames(cn('file'), cn(`file--axis-${axis}`))}>
        <div className={cn('file', 'sort-index')}>
          Page {sortIndex + 1}
        </div>

        <div className={cn('file', 'thumbnail')}>
          {preview}
        </div>

        <div className={cn('file', 'meta-name')}>
          {meta.name}
        </div>

        <div className={cn('file', 'meta-size')}>
          {filesize(meta.size)}
        </div>

        <a className={cn('file', 'remove-btn')}
           onClick={elem.remove}>
          <i className="fa fa-lg fa-times-circle"></i>
        </a>
      </li>
    )
  })

  return (
    <SortableContainerComponent
      pressDelay={200}
      axis={axis}
      items={items}
      onSortEnd={onSortEnd} />
  )
}

export default DropzoneComponent
export { IFileWithMeta } from 'react-dropzone-uploader'
