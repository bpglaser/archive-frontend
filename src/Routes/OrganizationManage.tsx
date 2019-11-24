import React from 'react';
import { Backend } from '../Data/Backend';
import { RouteComponentProps } from 'react-router';
import Breadcrumb from '../Components/Breadcrumb';
import { Organization } from '../Models/Organization';
import Loader from '../Components/Loader';
import ErrorPage from '../Components/ErrorPage';
import ReactTable, { CellInfo } from 'react-table';
import ToggleAdminButton from '../Components/ToggleAdminButton';
import { User } from '../Models/User';
import UserRemovePrompt from '../Components/Prompts/UserRemovePrompt';
import MagicSearch, { Suggestions } from '../Components/MagicSearch';
import Axios, { CancelTokenSource } from 'axios';
import { Invite } from '../Models/Invite';
import PendingInvitationsDisplay from '../Components/PendingInvitationsDisplay';
import { readTokenPayload } from '../Helpers';
import { displayError } from '../App';

interface Props extends RouteComponentProps<{ id: string }> {
  backend: Backend;
  token: string;
}

interface State {
  addedMessageTimer: NodeJS.Timeout | null;
  addedMessageVisible: boolean;
  errorMessage: string | null;
  loading: boolean;
  organization: Organization | null;
  pendingInvites: Invite[];
  users: { user: User, isAdmin: boolean }[];
  userToKick: User | null;
}

export default class OrganizationManage extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      addedMessageTimer: null,
      addedMessageVisible: false,
      errorMessage: null,
      loading: true,
      organization: null,
      pendingInvites: [],
      users: [],
      userToKick: null,
    };
  }

  componentDidMount = async () => {
    this.setState({
      errorMessage: null,
      loading: true,
      organization: null,
    });

    const organization = await this.loadOrganization();

    if (organization) {
      await this.loadPendingInvites(organization);
    }

    if (organization) {
      await this.loadUsers(organization);
    }

    this.setState({
      loading: false,
    });
  }

  componentDidUpdate = async (oldProps: Props) => {
    if (oldProps.match.params.id !== this.props.match.params.id) {
      await this.componentDidMount();
    }
  }

  render() {
    if (this.state.loading) {
      return <Loader />;
    }

    if (this.state.errorMessage) {
      return <ErrorPage errorMessage={this.state.errorMessage} retry={this.componentDidMount} />;
    }

    return (<div>
      <Breadcrumb
        links={[
          [this.state.organization!.name, "/organizations/" + this.getID()],
          ["Manage", "/organizations/" + this.getID() + "/manage"]
        ]}
      />

      <h3 className="title is-3">Manage {this.state.organization!.name}</h3>

      <h4 className="title is-4">Add New User</h4>

      <div className="columns is-vcentered">
        <div className="column is-narrow">
          <MagicSearch
            suggestionProvider={this.userSuggestionProvider}
          />
        </div>

        {this.state.addedMessageVisible &&
          <div className="column">
            <span className="help is-success">Invited!</span>
          </div>
        }
      </div>

      <br />

      {this.state.pendingInvites.length > 0 &&
        <div>
          <h4 className="title is-4">Pending Invitations</h4>

          <PendingInvitationsDisplay
            cancelInvite={this.cancelInvite}
            invites={this.state.pendingInvites}
          />

          <br />
        </div>
      }

      <h4 className="title is-4">Manage Existing Members</h4>

      <ReactTable
        columns={[
          { Header: 'Username', accessor: 'user.username' },
          { Header: 'Email', accessor: 'user.email' },
          { Header: 'Admin', Cell: this.renderAdminCell },
        ]}
        data={this.state.users}
        defaultPageSize={10}
      />

      {this.state.userToKick &&
        <UserRemovePrompt
          backend={this.props.backend}
          close={this.hideRemovePrompt}
          organization={this.state.organization!}
          success={this.userKicked}
          user={this.state.userToKick}
          token={this.props.token}
        />
      }
    </div>);
  }

  loadOrganization = async () => {
    try {
      const organization = await this.props.backend.getOrganizationDetails(this.props.token, this.getID());
      this.setState({
        organization: organization,
      });
      return organization;
    } catch (err) {
      console.log(err);
      this.setState({
        errorMessage: 'Error encountered while loading organization details.',
      });
    }
    return null;
  }

  loadUsers = async (organization: Organization) => {
    try {
      const users = await this.props.backend.getOrganizationUsers(this.props.token, organization);
      const loggedInUser = readTokenPayload(this.props.token);
      this.setState({
        users: users.filter(({ user }) => user.userID !== loggedInUser.userID),
      });
    } catch (err) {
      console.log(err);
      this.setState({
        errorMessage: 'Error encountered while loading organization users.',
      });
    }
  }

  renderAdminCell = (cellinfo: CellInfo, column: any) => {
    return (<div className="field is-grouped">
      <ToggleAdminButton
        {...this.props}
        organization={this.state.organization!}
        isAdmin={cellinfo.original.isAdmin}
        user={cellinfo.original.user}
        updated={this.userAdminStatusUpdated}
      />

      <p className="control">
        <button className="button is-warning" onClick={() => this.showRemovePrompt(cellinfo.original.user)}>Remove</button>
      </p>
    </div>);
  }

  hideRemovePrompt = () => {
    this.setState({
      userToKick: null,
    });
  }

  showRemovePrompt = (user: User) => {
    this.setState({
      userToKick: user,
    });
  }

  userKicked = (kickedUser: User) => {
    this.setState((oldState) => {
      const newUsers = oldState.users.filter(({ user }) => user.userID !== kickedUser.userID);
      return {
        users: newUsers,
        userToKick: null,
      };
    });
  }

  userAdminStatusUpdated = (updatedUser: User, updatedIsAdmin: boolean) => {
    this.setState((oldState) => {
      const newUsers = oldState.users.map(
        (oldUser) => oldUser.user.userID === updatedUser.userID ? { user: updatedUser, isAdmin: updatedIsAdmin } : oldUser);
      return {
        users: newUsers,
      };
    });
  }

  userSuggestionProvider = async (source: CancelTokenSource, search: string): Promise<Suggestions> => {
    try {
      const suggestions = await this.props.backend.getUserSuggestions(this.props.token, search, source);
      return suggestions.map((user) => ({
        suggestion: user.username,
        select: async () => await this.inviteUser(user),
      }));
    } catch (err) {
      if (!Axios.isCancel(err)) {
        console.log(err);
        displayError('Error encountered while looking up user suggestions.');
      }
      return [];
    }
  }

  inviteUser = async (user: User) => {
    try {
      const invite = await this.props.backend.inviteUserToOrganization(this.props.token, this.state.organization!, user);

      this.setState((oldState) => {
        if (oldState.addedMessageTimer) {
          clearTimeout(oldState.addedMessageTimer);
        }

        const addedMessageTimer = setTimeout(
          () => {
            this.setState({
              addedMessageVisible: false,
            });
          },
          2000
        );

        return {
          addedMessageTimer: addedMessageTimer,
          addedMessageVisible: true,
          pendingInvites: [...oldState.pendingInvites, invite],
        };
      });
    } catch (err) {
      console.log(err);
      displayError('Failed to invite user to organization.');
    }
  }

  loadPendingInvites = async (organization: Organization) => {
    try {
      const pendingInvites = await this.props.backend.getPendingInvites(this.props.token, organization);
      this.setState({
        pendingInvites: pendingInvites,
      });
    } catch (err) {
      console.log(err);
      displayError('Error encountered while loading pending invites.');
    }
  }

  cancelInvite = async (invite: Invite) => {
    try {
      await this.props.backend.cancelInvite(this.props.token, invite);
      this.setState((oldState) => ({
        pendingInvites: oldState.pendingInvites.filter((oldInvite) => oldInvite.inviteID !== invite.inviteID),
      }));
    } catch (err) {
      console.log(err);
      displayError('Error encountered while cancelling invite.');
    }
  }

  getID = () => {
    return Number(this.props.match.params.id);
  }
}
