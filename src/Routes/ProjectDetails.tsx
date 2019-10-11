import { NOT_FOUND } from 'http-status-codes';
import React from 'react';
import { RouteComponentProps } from 'react-router';
import Loader from '../Components/Loader';
import DeleteProjectPrompt from '../Components/Prompts/DeleteProjectPrompt';
import ProjectSettingsPrompt from '../Components/Prompts/ProjectSettingsPrompt';
import UploadFilePrompt from '../Components/Prompts/UploadPrompt';
import { Backend } from '../Data/Backend';
import { File } from '../Models/File';
import { Organization } from '../Models/Organization';
import { Project } from '../Models/Project';
import NotFound from './NotFound';
import { Link } from 'react-router-dom';

enum ProjectPrompt {
  Delete,
  Settings,
  Upload,
}

interface Props extends RouteComponentProps<{ id: string }> {
  backend: Backend;
  organization: Organization | null;
  token: string | null;
}

interface State {
  files: File[],
  loading: boolean;
  notFound: boolean;
  project: Project | null;
  visiblePrompt: ProjectPrompt | null;
}

export default class ProjectDetails extends React.Component<Props, State> {
  readonly projectID: number;

  constructor(props: any) {
    super(props)
    this.state = {
      files: [],
      loading: false,
      notFound: false,
      project: null,
      visiblePrompt: null,
    };

    this.projectID = Number(this.props.match.params.id);
  }

  async componentDidMount() {
    this.setState({
      loading: true,
    });

    await this.loadProject();
    await this.loadFiles();

    this.setState({
      loading: false,
    });
  }

  render() {
    if (this.state.loading) {
      return <Loader />;
    }

    if (this.state.notFound) {
      return <NotFound />;
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

      {
        this.state.files.map((file, i) =>
          <div key={i}>
            <Link to={'/file/' + file.fileID}>{file.name}</Link>
          </div>
        )
      }

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

  loadProject = async () => {
    try {
      const loadedProject = await this.props.backend.getProjectDetails(this.props.token!, this.projectID);
      this.setState({
        project: loadedProject,
      });
    } catch (err) {
      if (err.response) {
        if (err.response.status === NOT_FOUND) {
          this.setState({
            notFound: true,
          });
        } else {
          // Unknown error code recieved
          console.log(err);
        }
      } else if (err.request) {
        // Server not responding
        console.log(err);
      } else {
        // Unknown error
        console.log(err);
      }
    }
  }

  loadFiles = async () => {
    try {
      const files = await this.props.backend.listFiles(this.props.token!, this.projectID);
      this.setState({
        files: files,
      });
    } catch (err) {
      // TODO
      console.log(err);
    }
  }
}
