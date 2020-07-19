import React from 'react';
import { DropzoneFile } from './sandwich-dropzone-component';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';

interface SortableListState {
  items: DropzoneFile[]
}

interface SortableListProps extends SortableListState {
  onSortEnd: (sort: { oldIndex: number, newIndex: number }) => void
}

const SortableItem = SortableElement((element: { value: DropzoneFile }) => {
  const file = element.value;

  return (
    <li>
      <pre>name: {file.name}</pre>
      <pre>path: {file.path}</pre>
      <pre>type: {file.type}</pre>
      <pre>uuid: {file.upload.uuid}</pre>
    </li>
  );
});

const SortableList = SortableContainer((state: SortableListState) => {
  return (
    <ul>
      {state.items.map((file, index) => (
        <SortableItem
          key={file.upload.uuid}
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
    return <SortableList items={this.props.items} onSortEnd={this.props.onSortEnd} />;
  }
}

export { arrayMove } from 'react-sortable-hoc';
