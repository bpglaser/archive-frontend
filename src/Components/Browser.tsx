import React from 'react';
import { File } from '../Models/File';
import BrowserRow from './BrowserRow';
import Preview from './Preview';

interface Props {
  files: File[];
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
    return (<div className="columns">
      <div className="column is-three-quarters">
        <table className="table is-fullwidth">
          <thead>
            {createKey()}
          </thead>

          <tfoot>
            {createKey()}
          </tfoot>

          <tbody>
            {
              this.props.files.map((file, i) =>
                <BrowserRow
                  active={false}
                  file={file}
                  key={i}
                  rowNum={i} />
              )
            }
          </tbody>
        </table>

        {/* <Pager
          max={this.props.maxPages}
          nextButtonClicked={this.nextButtonClicked}
          numberButtonClicked={this.numberButtonClicked}
          previousButtonClicked={this.previousButtonClicked}
          selected={this.state.selected} /> */}
      </div>

      <Preview
      />
    </div>)
  }

  // nextButtonClicked = (event: React.MouseEvent<HTMLButtonElement>) => {
  //   if (this.state.selected < this.props.maxPages) {
  //     this.setState({
  //       selected: this.state.selected + 1,
  //     })
  //   }
  // }

  // numberButtonClicked = (n: number) => {
  //   if (n >= 1 && n <= this.props.maxPages) {
  //     this.setState({
  //       selected: n,
  //     })
  //   }
  // }

  // previousButtonClicked = (event: React.MouseEvent<HTMLButtonElement>) => {
  //   if (this.state.selected > 1) {
  //     this.setState({
  //       selected: this.state.selected - 1,
  //     })
  //   }
  // }
}

function createKey() {
  return (<tr>
    <th>Name</th>
    <th>Uploader</th>
  </tr>);
}
