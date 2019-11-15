import React from 'react';
import { Backend } from '../Data/Backend';
import InviteDisplay from './InviteDisplay';
import { Invite } from '../Models/Invite';

interface Props {
  backend: Backend;
  displayError: (errorMessage: string) => void;
  reloadOrganizations: () => void;
  token: string;
}

interface State {
  invites: Invite[];
  updateTimer?: NodeJS.Timeout;
}

export default class InviteBell extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      invites: [],
    };
  }

  componentDidMount = async () => {
    await this.loadInvites();

    const timeout = setInterval(this.loadInvites, 15 * 1000);
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
    if (this.state.invites.length === 0) {
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
            this.state.invites.map((invite, i) =>
              <InviteDisplay
                accepted={this.inviteAccepted}
                backend={this.props.backend}
                clearInvite={this.removeInvite}
                displayError={this.props.displayError}
                invite={invite}
                key={i}
                reloadInvites={this.loadInvites}
                token={this.props.token}
              />
            )
          }
        </div>
      </div>
    </div>);
  }

  loadInvites = async () => {
    try {
      const invites = await this.props.backend.getInvites(this.props.token);
      this.setState({
        invites: invites,
      });
    } catch (err) {
      console.log(err);
    }
  }

  inviteAccepted = (invite: Invite) => {
    this.props.reloadOrganizations();
    this.removeInvite(invite);
  }

  removeInvite = (inviteToRemove: Invite) => {
    this.setState((oldState) => ({
      invites: oldState.invites.filter((oldInvite) => oldInvite.inviteID !== inviteToRemove.inviteID),
    }));
  }
}

