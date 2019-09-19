import React from 'react';
import { InviteDetails } from '../Data/Backend';

interface Props {
  acceptClicked: () => void;
  buttonsDisabled: boolean;
  declineClicked: () => void;
  details: InviteDetails | null;
}

export default class JoinProject extends React.Component<Props> {
  render() {
    if (this.props.details) {
      const { inviter, project } = this.props.details;

      return (<div className="card">
        <header className="card-header">
          <p className="card-header-title">
            {inviter.email} has invited you to join {project.title}
          </p>
        </header>
        <div className="card-content">
          <div className="content">
            {project.description}
          </div>
        </div>
        <footer className="card-footer">
          <div className="card-footer-item">
            <div className="field is-grouped">
              <p className="control">
                <button
                  className={this.buttonSuffix("button is-success")}
                  onClick={this.props.acceptClicked}
                  disabled={this.props.buttonsDisabled}>
                  Accept
                </button>
              </p>
              <p className="control">
                <button
                  className={this.buttonSuffix("button is-danger")}
                  onClick={this.props.declineClicked}
                  disabled={this.props.buttonsDisabled}>
                  Decline
                </button>
              </p>
            </div>
          </div>
        </footer>
      </div>);
    } else {
      // TODO
      return (<div>
        Loading...
      </div>);
    }
  }

  buttonSuffix = (className: string): string => {
    return this.props.buttonsDisabled ? className + ' is-loading' : className;
  }
}
