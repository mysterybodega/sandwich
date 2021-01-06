import React, { useEffect, useState, FC } from 'react'

import Dropzone, {
  IDropzoneProps,
  IFileWithMeta,
  ILayoutProps,
  IInputProps,
  defaultClassNames
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

import FileType from '../lib/FileType'
import { createPDF, createPDFPreviewUrl } from '../lib/PDFHelpers'

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
        setFiles(state.files.concat(file))

        // TODO: This is buggy and causes errors when uploading a lot of files.
        // createPDFPreviewUrl(file.file).then((previewUrl) => {
        //   file.meta.previewUrl = previewUrl
        // })
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
    if (state.files.length === 0) {
      return
    }

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

  const LayoutComponent: FC<ILayoutProps> = ({
    input,
    dropzoneProps
  }) => (
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

          <a className={classNames(cn('header', 'btn'))}>
            {input}
          </a>
        </div>
      </div>

      <div className={cn('body')}>
        <div {...dropzoneProps}>
          <span className={defaultClassNames.inputLabel} style={{ cursor: 'unset' }}>
            {state.files.length == 0 && <div className="dropzone-text">
              <div>Drag Files</div>
              <div className="dropzone-subtext">(jpeg, png, pdf)</div>
            </div>}
            {state.files.length >= 1 && <SortableListComponent axis={state.axis}
                                                               items={state.files}
                                                               onSortEnd={handleSortEnd} />}
          </span>
        </div>
      </div>

      <div className={cn('footer')}>
        <button
          onClick={handleClick}
          className={classNames({ disabled: state.files.length === 0 })}>
          Make PDF
        </button>
      </div>
    </div>
  )

  const InputComponent: FC<IInputProps> = ({ accept, onFiles, getFilesFromEvent }) => (
    <label>
      <i className="fa fa-lg fa-plus"></i>
      <input
        style={{ display: 'none' }}
        type="file"
        accept={accept}
        multiple
        onChange={async (e) => onFiles(await getFilesFromEvent(e))}
      />
    </label>
  )

  return (
    <Dropzone
      accept="image/jpeg,image/png,.pdf"
      onChangeStatus={handleChangeStatus}
      LayoutComponent={LayoutComponent}
      InputComponent={InputComponent}
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
      preview = <div style={{ backgroundImage: `url(${meta.previewUrl})` }}></div>
    }

    const [hover, setHover] = useState<boolean>(false)
    const handleMouseEnter = () => setHover(true)
    const handleMouseLeave = () => setHover(false)

    return (
      <li className={classNames(cn('file'), cn(`file--axis-${axis}`))}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}>
        <span className={cn('file', 'sort-index')}>
          Page {sortIndex + 1}
        </span>

        <span className={cn('file', 'thumbnail')}>
          {preview}
        </span>

        <span className={cn('file', 'meta-name')}>
          {meta.name}
        </span>

        <span className={cn('file', 'meta-size')}>
          {filesize(meta.size)}
        </span>

        <span className={cn('file', 'remove')}>
          <a className={cn('file', 'remove-btn')}
             style={{ display: hover ? 'block' : 'none' }}
             onClick={elem.remove}>
            <i className="fa fa-lg fa-times-circle"></i>
          </a>
        </span>
      </li>
    )
  })

  return (
    <SortableContainerComponent
      pressDelay={100}
      helperClass={cn('file--grabbing')}
      axis={axis}
      items={items}
      onSortEnd={onSortEnd} />
  )
}

export default DropzoneComponent
export { IFileWithMeta } from 'react-dropzone-uploader'
