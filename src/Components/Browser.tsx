import React from "react";
import { ArchiveEntry } from "../Models/helpers";
import BrowserRow from "./BrowserRow";
import Loader from "./Loader";
import Pager from "./Pager";

interface Props {
  activeEntry: ArchiveEntry;
  entries: ArchiveEntry[];
  loading: boolean;
  maxPages: number;
  rowClickedCallback: (entry: ArchiveEntry) => void;
}

interface State {
  selected: number;
}

export default class Browser extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      selected: 1,
    }
  }

  render() {
    return (<div className="column is-three-quarters">
      {this.props.loading &&
        <Loader />
      }

      <table className="table is-fullwidth">
        <thead>
          <tr>
            <th>Name</th>
            <th>Owner</th>
            <th>Date</th>
          </tr>
        </thead>

        <tfoot>
          <tr>
            <th>Name</th>
            <th>Owner</th>
            <th>Date</th>
          </tr>
        </tfoot>

        <tbody>
          {
            this.props.entries.map((entry, i) =>
              <BrowserRow
                active={this.props.activeEntry === entry}
                entry={entry}
                onClickCallback={this.props.rowClickedCallback}
                key={i}
                rowNum={i} />
            )
          }
        </tbody>
      </table>

      <Pager
        max={this.props.maxPages}
        nextButtonClicked={this.nextButtonClicked}
        numberButtonClicked={this.numberButtonClicked}
        previousButtonClicked={this.previousButtonClicked}
        selected={this.state.selected} />
    </div>)
  }

  nextButtonClicked = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (this.state.selected < this.props.maxPages) {
      this.setState({
        selected: this.state.selected + 1,
      })
    }
  }

  numberButtonClicked = (n: number) => {
    if (n >= 1 && n <= this.props.maxPages) {
      this.setState({
        selected: n,
      })
    }
  }

  previousButtonClicked = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (this.state.selected > 1) {
      this.setState({
        selected: this.state.selected - 1,
      })
    }
  }
}
