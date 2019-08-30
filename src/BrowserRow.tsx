import React from "react";
import { ArchiveEntry } from "./helpers";

type BrowserRowProps = {
  active: boolean,
  entry: ArchiveEntry,
  onClickCallback: (entry: ArchiveEntry) => void,
  rowNum: number,
}

export default class BrowserRow extends React.Component<BrowserRowProps> {
  render() {
    let entry = this.props.entry
    return (<tr onMouseOver={() => this.props.onClickCallback(entry)}>
      <td>{entry.name}</td>
      <td>{entry.owner}</td>
      <td>{entry.uploaded.toISOString()}</td>
    </tr>)
  }
}