import React from 'react';
import { RouteComponentProps } from 'react-router';
import Loader from '../Components/Loader';
import OrganizationDeletePrompt from '../Components/Prompts/OrganizationDeletePrompt';
import { Backend } from '../Data/Backend';
import { Organization } from '../Models/Organization';
import { Project } from '../Models/Project';
import OrganizationSettingsPrompt from './OrganizationSettingsPrompt';

enum VisiblePrompt {
  Delete,
  Settings,
}

interface Props extends RouteComponentProps<{ id: string }> {
  backend: Backend;
  token: string | null;
}

interface State {
  errorMessage: string | null;
  loading: boolean;
  organization: Organization | null;
  projects: Project[];
  visiblePrompt: VisiblePrompt | null;
}

export default class OrganizationDetails extends React.Component<Props, State> {
  readonly id: number;

  constructor(props: Props) {
    super(props);
    this.state = {
      errorMessage: null,
      loading: true,
      organization: null,
      projects: [],
      visiblePrompt: null,
    };
    this.id = Number(this.props.match.params.id);
    // TODO validate token
  }

  async componentDidMount() {
    await this.loadOrganization();
    await this.loadProjects();
    this.setState({
      loading: false,
    });
  }

  render() {
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

      {this.state.visiblePrompt === VisiblePrompt.Delete &&
        <OrganizationDeletePrompt />
      }

      {this.state.visiblePrompt === VisiblePrompt.Settings &&
        <OrganizationSettingsPrompt />
      }
    </div>);
  }

  loadOrganization = async () => {
    try {
      const organization = await this.props.backend.getOrganizationDetails(this.props.token!, this.id);
      this.setState({
        organization: organization,
      });
    } catch (err) {
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
}
