import React from 'react';
import DeleteProjectPrompt from '../Components/Prompts/DeleteProjectPrompt';
import ProjectSettingsPrompt from '../Components/Prompts/ProjectSettingsPrompt';
import UploadFilePrompt from '../Components/Prompts/UploadPrompt';
import { Backend } from '../Data/Backend';
import { Organization } from '../Models/Organization';
import { Project } from '../Models/Project';
import { RouteComponentProps } from 'react-router';
import Loader from '../Components/Loader';
import { File } from '../Models/File';

enum ProjectPrompt {
  Delete,
  Settings,
  Upload,
}

interface Params {
  id: string;
}

interface Props extends RouteComponentProps<Params> {
  backend: Backend;
  organization: Organization | null;
  token: string | null;
}

interface State {
  loading: boolean;
  project: Project | null;
  visiblePrompt: ProjectPrompt | null;
}

export default class ProjectDetails extends React.Component<Props, State> {
  readonly projectID: number;

  constructor(props: any) {
    super(props)
    this.state = {
      loading: false,
      project: null,
      visiblePrompt: null,
    };

    this.projectID = Number(this.props.match.params.id);
  }

  async componentDidMount() {
    try {
      this.setState({
        loading: true,
      });

      const loadedProject = await this.props.backend.getProjectDetails(this.props.token!, this.projectID);
      this.setState({
        project: loadedProject,
      });
    } catch (err) {
      // TODO handle
    } finally {
      this.setState({
        loading: false,
      });
    }
  }

  render() {
    if (this.state.loading) {
      return <Loader />;
    }

    return (<div>
      <nav className="level">
        <div className="level-left">
        </div>

        <div className="level-right">
          <p className="level-item">
            <button className="button" onClick={this.showUploadPrompt}>
              <span className="icon">
                <i className="fas fa-upload"></i>
              </span>
              <span>
                Upload
              </span>
            </button>
          </p>
          <p className="level-item">
            <button className="button" onClick={this.showSettingsPrompt}>
              <span className="icon">
                <i className="fas fa-cog"></i>
              </span>
            </button>
          </p>
        </div>
      </nav>

      {this.state.visiblePrompt === ProjectPrompt.Delete &&
        <DeleteProjectPrompt
          backend={this.props.backend}
          close={this.closePrompt}
          organization={this.props.organization!} // TODO validate
          project={this.state.project!} // TODO validate
          success={this.closePrompt} // TODO redirect
          token={this.props.token!} />
      }

      {this.state.visiblePrompt === ProjectPrompt.Settings &&
        <ProjectSettingsPrompt
          backend={this.props.backend}
          close={this.closePrompt}
          project={this.state.project!} // TODO ensure project is not null
          showDeletePrompt={this.showDeletePrompt}
          success={this.projectUpdated}
          token={this.props.token!} // TODO ensure token not null
        />
      }

      {this.state.visiblePrompt === ProjectPrompt.Upload &&
        <UploadFilePrompt
          backend={this.props.backend}
          close={this.closePrompt}
          closeWithSuccess={this.fileSuccessfullyUploaded}
          project={this.state.project!}
          token={this.props.token!}
        />
      }
    </div>);
  }

  closePrompt = () => {
    this.setState({
      visiblePrompt: null,
    });
  }

  fileSuccessfullyUploaded = (file: File) => {
    this.closePrompt();
  }

  showDeletePrompt = () => {
    this.setState({
      visiblePrompt: ProjectPrompt.Delete,
    });
  }

  showSettingsPrompt = () => {
    this.setState({
      visiblePrompt: ProjectPrompt.Settings,
    });
  }

  showUploadPrompt = () => {
    this.setState({
      visiblePrompt: ProjectPrompt.Upload,
    });
  }

  projectUpdated = (project: Project) => {
    this.setState({
      project: project,
      visiblePrompt: null,
    });
  }
}
