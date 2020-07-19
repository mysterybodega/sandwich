import React from 'react';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import arrayMove from 'array-move';

const _SortableItem = SortableElement(
  (element: { value: string }) => <li>{element.value}</li>
);

const _SortableList = SortableContainer((container: { items: string[] }) => {
  return (
    <ul>
      {container.items.map((value, index) => (
        <_SortableItem key={`item-${value}`} index={index} value={value} />
      ))}
    </ul>
  );
});

export class SortableList extends React.Component {
  state = {
    items: ['A', 'B', 'C']
  };

  onSortEnd = (item: { oldIndex: number, newIndex: number }): void => {
    this.setState((state: { items: string[] }) => ({
      items: arrayMove(state.items, item.oldIndex, item.newIndex),
    }));
  };

  render(): React.ReactElement {
    return (
      <_SortableList items={this.state.items} onSortEnd={this.onSortEnd} />
    );
  }
}
