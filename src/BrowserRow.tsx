import React from "react";
import { ArchiveEntry } from "./helpers";
import './BrowserRow.css';

type BrowserRowProps = {
  active: boolean,
  entry: ArchiveEntry,
  onClickCallback: (entry: ArchiveEntry) => void,
  rowNum: number,
}

export default class BrowserRow extends React.Component<BrowserRowProps> {
  render() {
    let entry = this.props.entry
    let className = "browser-row"
    if (this.props.active) {
      className += " browser-row-active"
    }
    if (this.props.rowNum % 2 === 1) {
      className += " browser-row-odd"
    }
    return (
      <div className={className} onMouseOver={() => this.props.onClickCallback(entry)}>
        <div className="browser-element">{entry.name}</div>
        <div className="browser-element">{entry.owner}</div>
        <div className="browser-element">{entry.uploaded.toISOString()}</div>
      </div>
    )
  }
}