import React from 'react';
import { ArchiveEntry } from '../Models/ArchiveEntry';

interface Props {
  active: boolean;
  entry: ArchiveEntry;
  onClickCallback: (entry: ArchiveEntry) => void;
  rowNum: number;
}

export default class BrowserRow extends React.Component<Props> {
  render() {
    const entry = this.props.entry;
    const className = this.props.active ? 'is-selected' : undefined;

    return (<tr className={className} onMouseOver={() => this.props.onClickCallback(entry)}>
      <td>{entry.name}</td>
      <td>{entry.owner}</td>
      <td>{entry.uploaded.toISOString()}</td>
    </tr>);
  }
}
