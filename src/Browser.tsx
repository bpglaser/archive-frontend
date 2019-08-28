import React from "react";
import { ArchiveEntry } from "./helpers";
import BrowserRow from "./BrowserRow";
import Pager from "./Pager";
import Loader from "./Loader";

type BrowserProps = {
  activeEntry: ArchiveEntry,
  entries: ArchiveEntry[],
  loading: boolean,
  rowClickedCallback: (entry: ArchiveEntry) => void,
}

class Browser extends React.Component<BrowserProps> {
  render() {
    return (
      <div className="browser">
        {this.props.loading &&
          <div className="browser-loader">
            <Loader />
          </div>
        }
        <div className="browser-header">
          <div className="browser-element">
            Name
          </div>
          <div className="browser-element">
            Owner
          </div>
          <div className="browser-element">
            Date
          </div>
        </div>
        {
          this.props.entries.map((entry, i) =>
            <BrowserRow
              active={entry === this.props.activeEntry}
              entry={entry}
              onClickCallback={this.props.rowClickedCallback}
              rowNum={i}
              key={i}/>)
        }
        <Pager max={100} selected={7} />
      </div>
    )
  }
}

export default Browser
