import React from 'react';

interface Props {
  close: () => void;
  errorMessage: string;
}

interface State {

}

export default class ErrorDisplay extends React.Component<Props, State> {
  timeoutID?: NodeJS.Timeout;

  constructor(props: Props) {
    super(props);
    this.state = {

    };
  }

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
