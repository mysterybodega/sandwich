import 'react-dropzone-uploader/dist/styles.css'

import React, { Component, FC, ReactElement } from 'react';
import Dropzone, { IDropzoneProps, ILayoutProps } from 'react-dropzone-uploader'

export interface ISandwichDropzoneProps {
  onSubmit?: IDropzoneProps['onSubmit']
  onChangeStatus?: IDropzoneProps['onChangeStatus']
}

export class SandwichDropzoneComponent extends Component<ISandwichDropzoneProps> {
  constructor(props: ISandwichDropzoneProps) {
    super(props);
  }

  render(): ReactElement {
    return (
      <Dropzone
        accept="image/jpeg,image/png,.pdf"
        onChangeStatus={this.props.onChangeStatus}
        LayoutComponent={Layout}
        onSubmit={this.props.onSubmit} />
    );
  }
}

const Layout: FC<ILayoutProps> = ({ input, previews, submitButton, dropzoneProps, files, extra: { maxFiles } }) => {
  return (
    <div>
      <div {...dropzoneProps}>{input}</div>
    </div>
  )
}

export { IDropzoneProps, IFileWithMeta } from 'react-dropzone-uploader';
