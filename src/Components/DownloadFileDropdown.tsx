import React from 'react';

interface Props {
  downloadClicked: (extension?: string) => void;
  formatList: string[];
}

interface State {
}

export default class DownloadFileDropdown extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
    };
  }

  render() {
    /* eslint-disable jsx-a11y/anchor-is-valid */
    return (<div className="dropdown is-hoverable">
      <div className="dropdown-trigger">
        <button className="button is-info">
          <span>
            Alternative Formats
          </span>
          <span className="icon">
            <i className="fas fa-angle-down"></i>
          </span>
        </button>
      </div>

      <div className="dropdown-menu">
        <div className="dropdown-content">
          {
            this.props.formatList.map((entry, i) => 
              <a className="dropdown-item" key={i} onClick={() => this.props.downloadClicked(entry)}>
                Download as .{entry}
              </a>
            )
          }
        </div>
      </div>
    </div>);
    /* eslint-enable jsx-a11y/anchor-is-valid */
  }
}

