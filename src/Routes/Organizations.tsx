import * as React from 'react';
import { Redirect } from 'react-router';
import Breadcrumb from '../Components/Breadcrumb';
import ErrorPage from '../Components/ErrorPage';
import Loader from '../Components/Loader';
import OrganizationCard from '../Components/OrganizationCard';
import CreateOrganizationPrompt from '../Components/Prompts/CreateOrganizationPrompt';
import { Backend } from '../Data/Backend';
import { isAdmin } from '../Helpers';
import { Organization } from '../Models/Organization';

interface Props {
  backend: Backend;
  token: string;
}

interface State {
  createOrganizationPromptVisible: boolean;
  errorMessage: string | null;
  loading: boolean;
  organizations: Organization[];
  redirect: string | null;
}

export default class Organizations extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      createOrganizationPromptVisible: false,
      errorMessage: null,
      loading: false,
      organizations: [],
      redirect: null,
    };
  }

  componentDidMount = async () => {
    this.setState({
      errorMessage: null,
      loading: true,
      organizations: [],
    });

    await this.loadOrganizations();

    this.setState({
      loading: false,
    });
  }

  render() {
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />;
    }

    if (this.state.loading) {
      return <Loader />;
    }

    if (this.state.errorMessage) {
      return <ErrorPage errorMessage={this.state.errorMessage} retry={this.componentDidMount} />;
    }

    return (<div>
      <Breadcrumb
        links={[
          ["Organizations", "/organizations"],
        ]}
      />

      <div className="level">
        <div className="level-item">
          <h1 className="title">My Organizations</h1>
        </div>
      </div>

      {isAdmin(this.props.token) &&
        <div className="level">
          <div className="level-left">
            <div className="level-item">
              <button className="button" onClick={this.showCreateOrganizationPrompt}>

                <span className="icon">
                  <i className="fas fa-plus"></i>
                </span>

                <span>
                  Create New Organization
              </span>

              </button>
            </div>
          </div>
        </div>
      }

      {this.renderOrganizations()}

      {this.state.createOrganizationPromptVisible &&
        <CreateOrganizationPrompt
          backend={this.props.backend}
          close={this.hideCreateOrganizationPrompt}
          success={this.newOrganizationCreated}
          token={this.props.token} />
      }
    </div>);
  }

  renderOrganizations = () => {
    if (this.state.organizations.length === 0) {
      return (<span>You don't belong to any organizations.</span>);
    } else {
      return (<div className="organization-cards">
        {
          this.state.organizations.map((organization, i) =>
            <OrganizationCard organization={organization} key={i} />)
        }
      </div>);
    }
  }

  hideCreateOrganizationPrompt = () => {
    this.setState({
      createOrganizationPromptVisible: false,
    });
  }

  showCreateOrganizationPrompt = () => {
    this.setState({
      createOrganizationPromptVisible: true,
    });
  }

  newOrganizationCreated = (organization: Organization) => {
    this.hideCreateOrganizationPrompt();
    this.setState({
      redirect: '/organizations/' + organization.organizationID,
    });
  }

  loadOrganizations = async () => {
    try {
      const organizations = await this.props.backend.listOrganizations(this.props.token);
      this.setState({
        organizations: organizations,
      });
    } catch (err) {
      this.setState({
        errorMessage: 'Error encountered while loading organizations.',
      });
    }
  }
}
