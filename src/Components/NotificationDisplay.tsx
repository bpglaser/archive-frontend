import React from 'react';
import Notification from '../Data/Notification';

interface Props {
  notification: Notification;
}

interface State {
}

export default class NotificationDisplay extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
    };
  }

  render() {
    /* eslint-disable jsx-a11y/anchor-is-valid */
    const { inviter, organization } = this.props.notification.content;

    return (<div className="dropdown-item">
      <p>
        <strong>{inviter.email}</strong> has invited you to join <strong>{organization.name}</strong>.
      </p>
      <p>
        <a onClick={this.accept}>Accept</a> <a onClick={this.decline}>Decline</a>
      </p>
    </div>);
    /* eslint-enable jsx-a11y/anchor-is-valid */
  }

  accept = async () => {
    // TODO impl
  }

  decline = async () => {
    // TODO impl
  }
}

