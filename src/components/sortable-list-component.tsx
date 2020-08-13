import React, { FC } from 'react'
import { IFileWithMeta } from './dropzone-component'
import { SortableContainer, SortableElement } from 'react-sortable-hoc'

interface ISortableListProps {
  items: IFileWithMeta[]
  onSortEnd: (sort: { oldIndex: number, newIndex: number }) => void
}

const SortableListComponent: FC<ISortableListProps> = ({ items, onSortEnd }) => {
  return (
    <SortableContainerComponent axis={'xy'} items={items} onSortEnd={onSortEnd} />
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
  const file = item.value

  return (
    <li className="square">
      <div>
        <button onClick={file.remove}>Remove File</button>
        <img src={file.meta.previewUrl} />
      </div>
      <div>
        <span>{file.meta.name}</span>
      </div>
    </li>
  )
})

export default SortableListComponent
export { arrayMove } from 'react-sortable-hoc'
