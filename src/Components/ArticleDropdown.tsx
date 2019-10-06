import React from 'react';

interface Props {
  editClicked: () => void;
  deleteClicked: () => void;
}

interface State {

}

export default class ArticleDropdown extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {

    };
  }

  render() {
    /* eslint-disable jsx-a11y/anchor-is-valid */
    return (<div className="dropdown is-hoverable">
      <div className="dropdown-trigger">
        <button className="button" aria-haspopup="true" aria-controls="dropdown-menu">
          <span className="icon is-small">
            <i className="fas fa-ellipsis-v" aria-hidden="true"></i>
          </span>
        </button>
      </div>

      <div className="dropdown-menu" id="dropdown-menu" role="menu">
        <div className="dropdown-content">
          <a className="dropdown-item" onClick={this.props.editClicked}>
            Edit
          </a>
          <a className="dropdown-item" onClick={this.props.deleteClicked}>
            Delete
          </a>
        </div>
      </div>
    </div>);
    /* eslint-enable jsx-a11y/anchor-is-valid */
  }
}
