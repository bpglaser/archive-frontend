import React from "react";
import { ArchiveEntry } from "../helpers";

type Props = {
  activeEntry?: ArchiveEntry,
}

export default class Preview extends React.Component<Props> {
  render() {
    let entry = this.props.activeEntry
    if (entry) {
      return (<div className="column is-hidden-touch">
        <h1>{entry.name}</h1>
        <h2>{entry.owner}</h2>
        <img src={entry.path} alt="Preview" />
        <br />
        <div className="tags" style={{ maxWidth: "200px"}}>
          {
            entry.tags.map((content) =>
              <span className="tag is-info">{content}</span>)
          }
        </div>
        <button className="button">See Entry Details</button>
      </div>)
    } else {
      return (<div className="preview">
      </div>)
    }
  }
}