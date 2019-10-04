import React from 'react';

interface Props {
  close: () => void;
  errorMessage: string;
}

export default class ErrorDropdownDisplay extends React.Component<Props> {
  timeoutID?: NodeJS.Timeout;

  componentDidMount() {
    this.timeoutID = setTimeout(this.props.close, 5000);
  }

  componentWillUnmount() {
    if (this.timeoutID) {
      clearTimeout(this.timeoutID);
    }
  }

  render() {
    return (<div className="error-display">
      <div className="notification is-danger">
        <button className="delete" onClick={this.props.close}></button>
        {this.props.errorMessage}
      </div>
    </div>);
  }
}
