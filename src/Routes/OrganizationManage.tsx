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

interface Props extends RouteComponentProps<{ id: string }> {
  backend: Backend;
  displayError: (errorMessage: string) => void;
  token: string;
}

interface State {
  errorMessage: string | null;
  loading: boolean;
  organization: Organization | null;
  users: { user: User, isAdmin: boolean }[];
  userToKick: User | null;
}

export default class OrganizationManage extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      errorMessage: null,
      loading: true,
      organization: null,
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

      <ReactTable
        columns={[
          { Header: 'Username', accessor: 'user.email' },
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
      this.setState({
        users: users,
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

  getID = () => {
    return Number(this.props.match.params.id);
  }
}
