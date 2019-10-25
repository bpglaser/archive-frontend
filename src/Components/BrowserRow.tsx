import React from 'react';
import { File } from '../Models/File';
import { Link } from 'react-router-dom';

interface Props {
  active: boolean;
  file: File;
  rowNum: number;
}

export default class BrowserRow extends React.Component<Props> {
  render() {
    const file = this.props.file;
    const className = this.props.active ? 'is-selected' : undefined;

    return (<tr className={className}>
      <td><Link to={"/file/" + this.props.file.fileID}>{file.name}</Link></td>
      <td>{file.uploader ? file.uploader.email : ''}</td>
    </tr>);
  }
}
