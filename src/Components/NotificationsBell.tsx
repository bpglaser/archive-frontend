import React from 'react';
import { Backend } from '../Data/Backend';
import Notification from '../Data/Notification';
import NotificationDisplay from './NotificationDisplay';

interface Props {
  backend: Backend;
  token: string;
}

interface State {
  notifications: Notification[];
  updateTimer?: NodeJS.Timeout;
}

export default class NotificationsBell extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      notifications: [],
    };
  }

  componentDidMount = async () => {
    await this.loadNotifications();

    const timeout = setInterval(this.loadNotifications, 15 * 1000);
    this.setState({
      updateTimer: timeout,
    });
  }

  componentWillUnmount = () => {
    if (this.state.updateTimer) {
      clearInterval(this.state.updateTimer);
    }
  }

  render = () => {
    if (this.state.notifications.length === 0) {
      return null;
    }

    return (<div className="dropdown is-hoverable">
      <div className="dropdown-trigger">
        <span className="icon has-text-info shake">
          <i className="fa fa-bell"></i>
        </span>
      </div>

      <div className="dropdown-menu">
        <div className="dropdown-content">
          {
            this.state.notifications.map((notification, i) =>
              <NotificationDisplay notification={notification} key={i} />)
          }
        </div>
      </div>
    </div>);
  }

  loadNotifications = async () => {
    try {
      const notifications = await this.props.backend.getNotifications(this.props.token);
      this.setState({
        notifications: notifications,
      });
    } catch (err) {
      console.log(err);
    }
  }
}

