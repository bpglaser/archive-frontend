import React from 'react';
import { ArchiveEntry } from '../Models/ArchiveEntry';

interface Props {
  activeEntry?: ArchiveEntry;
}

export default class Preview extends React.Component<Props> {
  render() {
    const entry = this.props.activeEntry;

    if (entry) {
      return (<div className="column is-hidden-touch">
        <h1>{entry.name}</h1>
        <h2>{entry.owner}</h2>
        <img src={entry.path} alt="Preview" />
        <br />

        <div className="tags">
          {
            entry.tags.map((content, i) =>
              <span className="tag is-info" key={i}>{content}</span>)
          }
        </div>

        <button className="button">See Entry Details</button>
      </div>);
    } else {
      return (<div className="preview"></div>);
    }
  }
}
