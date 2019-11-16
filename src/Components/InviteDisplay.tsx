import React from 'react';
import { Invite } from '../Models/Invite';
import { Backend } from '../Data/Backend';
import { displayError } from '../App';
import { createErrorMessage } from '../Helpers';

interface Props {
  accepted: (invite: Invite) => void;
  backend: Backend;
  clearInvite: (invite: Invite) => void;
  invite: Invite;
  reloadInvites: () => void;
  token: string;
}

interface State {
}

export default class InviteDisplay extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
    };
  }

  render() {
    /* eslint-disable jsx-a11y/anchor-is-valid */
    const { inviter, organization } = this.props.invite;

    return (<div className="dropdown-item">
      <p>
        <strong>{inviter.username}</strong> has invited you to join <strong>{organization.name}</strong>.
      </p>
      <p>
        <a onClick={this.accept}>Accept</a> <a onClick={this.decline}>Decline</a>
      </p>
    </div>);
    /* eslint-enable jsx-a11y/anchor-is-valid */
  }

  accept = async () => {
    try {
      await this.props.backend.acceptInvite(this.props.token, this.props.invite);
      this.props.accepted(this.props.invite);
    } catch (err) {
      console.log(err);
      displayError(createErrorMessage(err, 'Error encountered while accepting invite.'));
      this.props.reloadInvites();
    }
  }

  decline = async () => {
    try {
      await this.props.backend.declineInvite(this.props.token, this.props.invite);
      this.props.clearInvite(this.props.invite);
    } catch (err) {
      console.log(err);
      displayError(createErrorMessage(err, 'Error encountered while declining invite.'));
      this.props.reloadInvites();
    }
  }
}

