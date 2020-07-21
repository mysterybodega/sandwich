import React, { Component, ReactElement } from 'react'
import { IFileWithMeta } from './sandwich-dropzone-component'
import { arrayMove, SortableContainer, SortableElement } from 'react-sortable-hoc'

interface ISortableListState {
  items: IFileWithMeta[]
}

interface ISortableListProps extends ISortableListState {
  onSortEnd: (sort: { oldIndex: number, newIndex: number }) => void
}

const SortableItem = SortableElement((element: { value: IFileWithMeta }) => {
  const file = element.value.file
  const meta = element.value.meta

  return (
    <li className="square">
      <img src={meta.previewUrl} />
    </li>
  )
})

const SortableList = SortableContainer((state: ISortableListState) => {
  return (
    <ul>
      {state.items.map((file, index) => (
        <SortableItem
          key={file.meta.id}
          index={index}
          value={file} />
      ))}
    </ul>
  )
})

export default class SandwichSortableGridComponent extends Component<ISortableListProps, ISortableListState> {
  constructor(props: ISortableListProps) {
    super(props)
    this.state = {
      items: props.items
    }
  }

  render(): ReactElement {
    return (
      <SortableList
        axis={'xy'}
        items={this.props.items}
        onSortEnd={this.props.onSortEnd} />
    )
  }
}

export { arrayMove } from 'react-sortable-hoc'
