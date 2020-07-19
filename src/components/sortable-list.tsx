import React from 'react';
import { DropzoneFile } from './dropzone';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';

export type SortEndHandler = (sort: { oldIndex: number, newIndex: number }) => void;

interface SortableListProps {
  items: DropzoneFile[],
  onSortEnd: SortEndHandler
}

interface SortableListState {
  items: DropzoneFile[]
}

const _SortableItem = SortableElement((element: { value: DropzoneFile }) => {
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

const _SortableList = SortableContainer((state: SortableListState) => {
  return (
    <ul>
      {state.items.map((file, index) => (
        <_SortableItem
          key={file.upload.uuid}
          index={index}
          value={file} />
      ))}
    </ul>
  );
});

export class SortableList extends React.Component<SortableListProps, SortableListState> {
  constructor(props: SortableListProps) {
    super(props);
    this.state = {
      items: props.items
    };
  }

  render(): React.ReactElement {
    return <_SortableList items={this.props.items} onSortEnd={this.props.onSortEnd} />;
  }
}

export { arrayMove } from 'react-sortable-hoc';
