import React from 'react';
import { Redirect, RouteComponentProps } from 'react-router';
import Breadcrumb from '../Components/Breadcrumb';
import ErrorPage from '../Components/ErrorPage';
import Loader from '../Components/Loader';
import ProjectPreviewCard from '../Components/ProjectPreviewCard';
import OrganizationDeletePrompt from '../Components/Prompts/OrganizationDeletePrompt';
import OrganizationSettingsPrompt from '../Components/Prompts/OrganizationSettingsPrompt';
import { Backend } from '../Data/Backend';
import { Organization } from '../Models/Organization';
import { Project } from '../Models/Project';

enum VisiblePrompt {
  Delete,
  Settings,
}

interface Props extends RouteComponentProps<{ id: string }> {
  backend: Backend;
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

export default class OrganizationDetails extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      errorMessage: null,
      loading: true,
      organization: null,
      projects: [],
      redirect: null,
      visiblePrompt: null,
    };
  }

  async componentDidMount() {
    await this.loadOrganization();
    await this.loadProjects();
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

      <nav className="level">
        <div className="level-left">
        </div>

        <div className="level-item">
          <h1 className="title">{this.state.organization!.name}</h1>
        </div>

        <div className="level-right">
          <button className="button" onClick={this.showSettingsPrompt}>
            <span className="icon">
              <i className="fas fa-cog"></i>
            </span>
          </button>
        </div>
      </nav>

      {
        this.state.projects.map((project, i) =>
          <ProjectPreviewCard project={project} key={i} />)
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
    } catch (err) {
      console.log(err);
      this.setState({
        errorMessage: 'Failed to load organization',
      });
    }
  }

  loadProjects = async () => {
    try {
      const projects = await this.props.backend.listProjects(this.props.token!, this.state.organization!.organizationID);
      this.setState({
        projects: projects,
      });
    } catch (err) {
      console.log(err);
      this.setState({
        errorMessage: 'Failed to load projects',
      });
    }
  }

  retryLoad = async () => {
    await this.loadOrganization();
    await this.loadProjects();
  }

  hidePrompt = () => {
    this.setState({
      visiblePrompt: null,
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

  organizationUpdated = (organization: Organization) => {
    // TODO should we reload the projects?
    this.setState({
      organization: organization,
    });
  }

  organizationDeleted = async () => {
    this.hidePrompt();
    this.setState({
      redirect: '/organizations',
    });
  }

  getID = () => {
    return Number(this.props.match.params.id);
  }
}
