import React from 'react';
import { Redirect, RouteComponentProps } from 'react-router';
import Breadcrumb from '../Components/Breadcrumb';
import ErrorPage from '../Components/ErrorPage';
import Loader from '../Components/Loader';
import ProjectsTable from '../Components/ProjectsTable';
import CreateProjectPrompt from '../Components/Prompts/CreateProjectPrompt';
import OrganizationDeletePrompt from '../Components/Prompts/OrganizationDeletePrompt';
import OrganizationSettingsPrompt from '../Components/Prompts/OrganizationSettingsPrompt';
import { Backend } from '../Data/Backend';
import { createErrorMessage } from '../Helpers';
import { Organization } from '../Models/Organization';
import { Project } from '../Models/Project';

enum VisiblePrompt {
  Create,
  Delete,
  Settings,
}

interface Props extends RouteComponentProps<{ id: string }> {
  backend: Backend;
  organizationDeleted: (organization: Organization) => void;
  token: string;
}

interface State {
  errorMessage: string | null;
  loading: boolean;
  organization: Organization | null;
  projects: Project[];
  redirect: string | null;
  visiblePrompt: VisiblePrompt | null;
}

function initialState(): State {
  return {
    errorMessage: null,
    loading: true,
    organization: null,
    projects: [],
    redirect: null,
    visiblePrompt: null,
  };
}

export default class OrganizationDetails extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = initialState();
  }

  async componentDidMount() {
    this.setState(initialState());

    const organization = await this.loadOrganization();
    if (organization) {
      await this.loadProjects(organization);
    }

    this.setState({
      loading: false,
    });
  }

  async componentDidUpdate(oldProps: Props) {
    if (this.props.match.params.id !== oldProps.match.params.id) {
      this.componentDidMount();
    }
  }

  render() {
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />;
    }

    if (this.state.loading) {
      return <Loader />;
    }

    if (this.state.errorMessage !== null) {
      return <ErrorPage
        errorMessage={this.state.errorMessage}
        retry={this.retryLoad}
      />
    }

    return (<div>
      <Breadcrumb
        links={[
          [this.state.organization!.name, "/organizations/" + this.state.organization!.organizationID],
        ]}
      />

      <div className="columns">
        <div className="column">
          <h1 className="title">
            {this.state.organization!.name}
          </h1>
        </div>

        <div className="column is-narrow">
          <div className="field is-grouped">
            <p className="control">
              <button className="button" onClick={this.showCreatePrompt}>
                <span className="icon">
                  <i className="fas fa-plus"></i>
                </span>
                <span>
                  Create New Project
                </span>
              </button>
            </p>

            {this.state.organization && this.state.organization.isAdmin &&
              <p className="level-item">
                <button className="button" onClick={this.showSettingsPrompt}>
                  <span className="icon">
                    <i className="fas fa-cog"></i>
                  </span>
                </button>
              </p>
            }
          </div>
        </div>
      </div>

      <p className="content">
        {this.state.organization!.description}
      </p>

      <ProjectsTable
        projects={this.state.projects}
      />

      {this.state.visiblePrompt === VisiblePrompt.Create && this.state.organization &&
        <CreateProjectPrompt
          backend={this.props.backend}
          close={this.hidePrompt}
          organization={this.state.organization}
          success={this.projectCreated}
          token={this.props.token}
        />
      }

      {this.state.visiblePrompt === VisiblePrompt.Delete && this.state.organization &&
        <OrganizationDeletePrompt
          backend={this.props.backend}
          close={this.hidePrompt}
          organization={this.state.organization}
          success={this.organizationDeleted}
          token={this.props.token}
        />
      }

      {this.state.visiblePrompt === VisiblePrompt.Settings && this.state.organization &&
        <OrganizationSettingsPrompt
          backend={this.props.backend}
          close={this.hidePrompt}
          organization={this.state.organization}
          showDeletePrompt={this.showDeletePrompt}
          success={this.organizationUpdated}
          token={this.props.token}
        />
      }
    </div>);
  }

  loadOrganization = async () => {
    try {
      const organization = await this.props.backend.getOrganizationDetails(this.props.token!, this.getID());
      this.setState({
        organization: organization,
      });
      return organization;
    } catch (err) {
      console.log(err);
      this.setState({
        errorMessage: createErrorMessage(err, 'Failed to load organization'),
      });
      return null;
    }
  }

  loadProjects = async (organization: Organization) => {
    try {
      const projects = await this.props.backend.listProjects(this.props.token!, organization.organizationID);
      this.setState({
        projects: projects,
      });
    } catch (err) {
      console.log(err);
      this.setState({
        errorMessage: createErrorMessage(err, 'Failed to load projects'),
      });
    }
  }

  retryLoad = async () => {
    const organization = await this.loadOrganization();
    if (organization) {
      await this.loadProjects(organization);
    }
  }

  hidePrompt = () => {
    this.setState({
      visiblePrompt: null,
    });
  }

  showCreatePrompt = () => {
    this.setState({
      visiblePrompt: VisiblePrompt.Create,
    });
  }

  showSettingsPrompt = () => {
    this.setState({
      visiblePrompt: VisiblePrompt.Settings,
    });
  }

  showDeletePrompt = () => {
    this.setState({
      visiblePrompt: VisiblePrompt.Delete,
    });
  }

  organizationUpdated = async (organization: Organization) => {
    this.setState({
      organization: organization,
      visiblePrompt: null,
    });
    await this.loadProjects(organization);
  }

  organizationDeleted = async () => {
    this.props.organizationDeleted(this.state.organization!);
    this.hidePrompt();
    this.setState({
      redirect: '/',
    });
  }

  projectCreated = (project: Project) => {
    this.setState((prev) => ({
      projects: [project, ...prev.projects],
      visiblePrompt: null,
    }));
  }

  getID = () => {
    return Number(this.props.match.params.id);
  }
}
