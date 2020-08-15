import React, { FC } from 'react'
import { IFileWithMeta } from './dropzone-component'
import { SortableContainer, SortableElement } from 'react-sortable-hoc'
import { FileType } from '../lib/file-type'

export type Axis = 'x' | 'y' | 'xy'

interface ISortableListProps {
  axis: Axis,
  items: IFileWithMeta[]
  onSortEnd: (sort: { oldIndex: number, newIndex: number }) => void
}

const SortableListComponent: FC<ISortableListProps> = ({ axis, items, onSortEnd }) => {
  return (
    <SortableContainerComponent axis={axis} items={items} onSortEnd={onSortEnd} />
  )
}

const SortableContainerComponent = SortableContainer((props: ISortableListProps) => {
  return (
    <ul>
      {props.items.map((file, index) => (
        <SortableElementComponent key={file.meta.id} index={index} value={file} />
      ))}
    </ul>
  )
})

const SortableElementComponent = SortableElement((item: { value: IFileWithMeta }) => {
  const elem = item.value
  const file = item.value.file
  const meta = item.value.meta

  let preview;

  if (file.type === FileType.PDF) {
    preview = <object type={FileType.PDF} data={meta.previewUrl} />
  } else {
    preview = <img src={meta.previewUrl} />
  }

  return (
    <li className="square">
      <button onClick={elem.remove}>Remove File</button>
      <div>
        {preview}
      </div>
      <span>{meta.name}</span>
    </li>
  )
})

export default SortableListComponent
export { arrayMove } from 'react-sortable-hoc'
