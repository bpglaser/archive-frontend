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
    return (<div className="column is-three-quarters">
      {this.props.loading &&
        <Loader />
      }

      <table className="table is-fullwidth">
        <thead>
          <th>Name</th>
          <th>Owner</th>
          <th>Date</th>
        </thead>

        <tfoot>
          <th>Name</th>
          <th>Owner</th>
          <th>Date</th>
        </tfoot>

        <tbody>
          {
            this.props.entries.map((entry, i) =>
              <BrowserRow
                active={this.props.activeEntry === entry}
                entry={entry}
                onClickCallback={this.props.rowClickedCallback}
                rowNum={i} />
            )
          }
        </tbody>
      </table>

      <Pager max={100} selected={7} />
    </div>)
  }
}

export default Browser
