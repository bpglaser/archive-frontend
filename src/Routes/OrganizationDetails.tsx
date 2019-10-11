import React from 'react';
import { Redirect, RouteComponentProps } from 'react-router';
import Loader from '../Components/Loader';
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
  clearActiveOrganization: () => Promise<void>;
  token: string | null;
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
      redirect: this.props.token === null ? '/' : null,
      visiblePrompt: null,
    };
  }

  async componentDidMount() {
    if (this.props.token) {
      await this.loadOrganization();
      await this.loadProjects();
      this.setState({
        loading: false,
      });
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.token !== prevProps.token) {
      this.setState({
        redirect: this.props.token === null ? '/' : this.state.redirect,
      });
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
      return (<div>{this.state.errorMessage}</div>);
    }
    return (<div>
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

      {this.state.visiblePrompt === VisiblePrompt.Delete && this.state.organization &&
        <OrganizationDeletePrompt
          backend={this.props.backend}
          close={this.hidePrompt}
          organization={this.state.organization}
          success={this.organizationDeleted}
          token={this.props.token!}
        />
      }

      {this.state.visiblePrompt === VisiblePrompt.Settings && this.state.organization &&
        <OrganizationSettingsPrompt
          backend={this.props.backend}
          close={this.hidePrompt}
          organization={this.state.organization}
          showDeletePrompt={this.showDeletePrompt}
          success={this.organizationUpdated}
          token={this.props.token!}
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
    await this.props.clearActiveOrganization();
    this.setState({
      redirect: '/organizations',
    });
  }

  getID = () => {
    return Number(this.props.match.params.id);
  }
}
