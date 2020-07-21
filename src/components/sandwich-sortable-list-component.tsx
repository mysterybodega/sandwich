import React from 'react';
import { IFileWithMeta } from './sandwich-dropzone-component';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';

interface SortableListState {
  items: IFileWithMeta[]
}

interface SortableListProps extends SortableListState {
  onSortEnd: (sort: { oldIndex: number, newIndex: number }) => void
}

const SortableItem = SortableElement((element: { value: IFileWithMeta }) => {
  const file = element.value.file;
  const meta = element.value.meta;

  return (
    <li className="square">
      <img height={100} src={meta.previewUrl} />
    </li>
  );
});

const SortableList = SortableContainer((state: SortableListState) => {
  return (
    <ul>
      {state.items.map((file, index) => (
        <SortableItem
          key={file.meta.id}
          index={index}
          value={file} />
      ))}
    </ul>
  );
});

export class SandwichSortableListComponent extends React.Component<SortableListProps, SortableListState> {
  constructor(props: SortableListProps) {
    super(props);
    this.state = {
      items: props.items
    };
  }

  render(): React.ReactElement {
    return (
      <SortableList
        axis={'xy'}
        items={this.props.items}
        onSortEnd={this.props.onSortEnd} />
    );
  }
}

export { arrayMove } from 'react-sortable-hoc';
