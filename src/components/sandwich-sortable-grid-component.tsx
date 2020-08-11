import React, { FC } from 'react'
import { IFileWithMeta } from './sandwich-dropzone-component'
import { SortableContainer, SortableElement } from 'react-sortable-hoc'

interface ISortableListProps {
  items: IFileWithMeta[]
  onSortEnd: (sort: { oldIndex: number, newIndex: number }) => void
}

const SortableItem = SortableElement((item: { value: IFileWithMeta }) => {
  const meta = item.value.meta

  return (
    <li className="square">
      <img src={meta.previewUrl} />
      <span>{meta.name}</span>
    </li>
  )
})

const SortableList = SortableContainer((props: ISortableListProps) => {
  return (
    <ul>
      {props.items.map((file, index) => (
        <SortableItem
          key={file.meta.id}
          index={index}
          value={file} />
      ))}
    </ul>
  )
})

const SandwichSortableGridComponent: FC<ISortableListProps> = ({ items, onSortEnd }) => {
  return (
    <SortableList
      axis={'xy'}
      items={items}
      onSortEnd={onSortEnd} />
  )
}

export default SandwichSortableGridComponent
export { arrayMove } from 'react-sortable-hoc'
