import React from "react";
import { ArchiveEntry } from "./helpers";
import Tag from "./Tag";
import Loader from "./Loader";

type Props = {
  activeEntry?: ArchiveEntry,
}

export default class Preview extends React.Component<Props> {
  render() {
    let entry = this.props.activeEntry
    if (entry) {
      return (<div className="preview">
        <h1>{entry.name}</h1>
        <h2>{entry.owner}</h2>
        <img src={entry.path} alt="Preview"/>
        <br />
        <div className="taglist">
          {
            entry.tags.map((content, i) =>
              <Tag content={content} deleteCallback={undefined} idx={i} key={i}/>)
          }
        </div>
        <button>See Entry Details</button>
      </div>)
    } else {
      return (<div className="preview">
      </div>)
    }
  }
}