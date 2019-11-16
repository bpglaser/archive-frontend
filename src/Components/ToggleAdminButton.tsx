import React from 'react';
import { User } from '../Models/User';
import { Backend } from '../Data/Backend';
import { Organization } from '../Models/Organization';
import { displayError } from '../App';
import { createErrorMessage } from '../Helpers';

interface Props {
  backend: Backend;
  isAdmin: boolean;
  organization: Organization;
  token: string;
  updated: (user: User, isAdmin: boolean) => void;
  user: User;
}

interface State {
  awaitingResponse: boolean;
}

export default class ToggleAdminButton extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      awaitingResponse: false,
    };
  }

  render() {
    return (<div className="buttons control has-addons">
      <button
        className={this.props.isAdmin ? "button is-danger is-selected" : "button"}
        disabled={this.props.isAdmin || this.state.awaitingResponse}
        onClick={this.toggleAdmin}
      >
        Admin
      </button>

      <button
        className={!this.props.isAdmin ? "button is-info is-selected" : "button"}
        disabled={!this.props.isAdmin || this.state.awaitingResponse}
        onClick={this.toggleAdmin}
      >
        Member
      </button>
    </div>);
  }

  toggleAdmin = async () => {
    this.setState({
      awaitingResponse: true,
    });

    try {
      await this.props.backend.setOrganizationAdmin(this.props.token, this.props.organization, this.props.user, !this.props.isAdmin);
      this.props.updated(this.props.user, !this.props.isAdmin);
    } catch (err) {
      console.log(err);
      displayError(createErrorMessage(err, 'Failed to set user as admin.'));
    }

    this.setState({
      awaitingResponse: false,
    });
  }
}

