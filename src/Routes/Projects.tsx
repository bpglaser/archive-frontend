import * as React from 'react';
import { Redirect } from 'react-router';
import ProjectPreviewCard from '../Components/ProjectPreviewCard';
import CreateProjectPrompt from '../Components/Prompts/CreateProjectPrompt';
import { Backend } from '../Data/Backend';
import { Organization } from '../Models/Organization';
import { Project } from '../Models/Project';

interface Props {
  backend: Backend;
  organization: Organization | null;
  token: string | null;
}

interface State {
  createNewProjectPromptVisible: boolean;
  loading: boolean;
  projects: Project[];
}

export default class Projects extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      createNewProjectPromptVisible: false,
      loading: false,
      projects: [],
    }
  }

  async componentDidMount() {
    if (this.props.organization && this.props.token) {
      this.setState({
        loading: true,
      });

      const projects = await this.props.backend.listProjects(this.props.token);

      this.setState({
        loading: true,
        projects: projects,
      });
    }
  }

  render() {
    if (!this.props.organization || !this.props.token) {
      // TODO prompt for login
      return <Redirect to="/" />
    }

    return (<div>
      <nav className="level">
        <div className="level-left">
          <div className="level-item">
            <button className="button" onClick={this.displayNewProjectDialog}>
              <span className="icon">
                <i className="fas fa-plus"></i>
              </span>
              <span>
                Create New Project
              </span>
            </button>
          </div>
        </div>
      </nav>

      <div className="projects">
        {
          this.state.projects.map((project, i) =>
            <ProjectPreviewCard project={project} key={i} />)
        }
      </div>

      {this.state.createNewProjectPromptVisible &&
        <CreateProjectPrompt
          backend={this.props.backend}
          close={this.closeProjectPrompt}
          organization={this.props.organization}
          success={this.newProjectCreated}
          token={this.props.token} />
      }
    </div>)
  }

  displayNewProjectDialog = () => {
    this.setState({
      createNewProjectPromptVisible: true,
    });
  }

  closeProjectPrompt = () => {
    this.setState({
      createNewProjectPromptVisible: false,
    });
  }

  newProjectCreated = (project: Project) => {
    this.setState({
      createNewProjectPromptVisible: false,
      projects: [...this.state.projects, project],
    });
  }
}
