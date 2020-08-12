import React, { FC } from 'react'
import { IFileWithMeta } from './sandwich-dropzone-component'
import { SortableContainer, SortableElement } from 'react-sortable-hoc'

interface ISortableListProps {
  items: IFileWithMeta[]
  onSortEnd: (sort: { oldIndex: number, newIndex: number }) => void
}

const SortableItem = SortableElement((item: { value: IFileWithMeta }) => {
  const file = item.value

  return (
    <li className="square">
      <button onClick={file.remove}>Remove File</button>
      <img src={file.meta.previewUrl} />
      <span>{file.meta.name}</span>
    </li>
  )
})

const SortableList = SortableContainer((props: ISortableListProps) => {
  return (
    <ul>
      {props.items.map((file, index) => (
        <SortableItem key={file.meta.id} index={index} value={file} />
      ))}
    </ul>
  )
})

const SandwichSortableGridComponent: FC<ISortableListProps> = ({ items, onSortEnd }) => {
  return (
    <SortableList axis={'xy'} items={items} onSortEnd={onSortEnd} />
  )
}

export default SandwichSortableGridComponent
export { arrayMove } from 'react-sortable-hoc'
