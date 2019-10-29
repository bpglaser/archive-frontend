import React from 'react';
import { RouteComponentProps, Redirect } from 'react-router';
import Breadcrumb from '../Components/Breadcrumb';
import Comments from '../Components/Comments';
import DownloadFileDropdown from '../Components/DownloadFileDropdown';
import ErrorPage from '../Components/ErrorPage';
import Loader from '../Components/Loader';
import NearbyColumn from '../Components/NearbyColumn';
import Tags from '../Components/Tags';
import { Backend } from '../Data/Backend';
import { File } from '../Models/File';
import { Organization } from '../Models/Organization';
import { Project } from '../Models/Project';
import FileSettingsPrompt from '../Components/Prompts/FileSettingsPrompt';
import FileDeletePrompt from '../Components/Prompts/FileDeletePrompt';

enum FilePrompt {
  Delete,
  Settings,
}

interface Props extends RouteComponentProps<{ id: string }> {
  backend: Backend;
  displayError: (s: string) => void;
  token: string;
}

interface State {
  errorMessage: string | null;
  file: File | null,
  imageDisplayUrl: string | null;
  loading: boolean;
  organization: Organization | null;
  project: Project | null;
  redirect: string | null;
  tags: string[];
  visiblePrompt: FilePrompt | null;
}

export default class FileDetails extends React.Component<Props, State> {
  readonly linkRef: React.RefObject<HTMLAnchorElement>;

  constructor(props: Props) {
    super(props);
    this.state = {
      errorMessage: null,
      file: null,
      imageDisplayUrl: null,
      loading: true,
      organization: null,
      project: null,
      redirect: null,
      tags: [],
      visiblePrompt: null,
    };
    this.linkRef = React.createRef();
  }

  async componentDidMount() {
    this.setState({
      errorMessage: null,
      loading: true,
    });

    const file = await this.loadFileDetails();
    if (file) {
      await this.loadTags(file);
    }
    await this.loadProjectDetails();
    await this.loadOrganizationDetails();
    await this.downloadDisplayImage();

    this.setState({
      loading: false,
    });
  }

  async componentDidUpdate(oldProps: Props) {
    if (this.props.match.params.id !== oldProps.match.params.id) {
      await this.componentDidMount();
    }
  }

  render() {
    /* eslint-disable jsx-a11y/anchor-has-content */
    /* eslint-disable jsx-a11y/anchor-is-valid */
    if (this.state.errorMessage !== null) {
      return <ErrorPage
        errorMessage={this.state.errorMessage}
        retry={this.componentDidMount}
      />
    }

    if (this.state.loading) {
      return <Loader />;
    }

    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />;
    }

    return (<div>
      <Breadcrumb
        links={[
          [this.state.organization!.name, '/organizations/' + this.state.organization!.organizationID],
          [this.state.project!.name, '/projects/' + this.state.project!.projectID],
          [this.state.file!.name, '/file/' + this.getID()],
        ]}
      />

      <div className="columns">
        <div className="column">
          <nav className="level">
            <div className="level-left">
              <div className="level-item">
                <h1 className="title">{this.state.file!.name}</h1>
              </div>
            </div>

            <div className="level-right">
              <div className="level-item">
                <button className="button is-primary" onClick={() => this.downloadClicked()}>
                  <span className="icon">
                    <i className="fas fa-download"></i>
                  </span>
                  <span>
                    Download Original
                    </span>
                </button>
              </div>
              <div className="level-item">
                <DownloadFileDropdown
                  downloadClicked={this.downloadClicked}
                  formatList={["png", "jpg"]}
                />
              </div>
              <div className="level-item">
                <button className="button" onClick={this.showSettingsPrompt}>
                  <span className="icon">
                    <i className="fas fa-cog"></i>
                  </span>
                </button>
              </div>
            </div>
          </nav>

          <Tags
            backend={this.props.backend}
            displayError={this.props.displayError}
            file={this.state.file!}
            tagsUpdated={this.updateTags}
            tags={this.state.tags}
            token={this.props.token}
          />

          {this.state.imageDisplayUrl &&
            <img src={this.state.imageDisplayUrl} alt="preview" />
          }

          {this.state.file &&
            <Comments
              backend={this.props.backend}
              file={this.state.file}
              token={this.props.token}
            />
          }
        </div>

        <NearbyColumn
          backend={this.props.backend}
          file={this.state.file}
          token={this.props.token!}
        />
      </div>

      {this.state.visiblePrompt === FilePrompt.Delete &&
        <FileDeletePrompt
          backend={this.props.backend}
          close={this.hidePrompt}
          file={this.state.file!}
          success={this.setRedirectToProject}
          token={this.props.token}
        />
      }

      {this.state.visiblePrompt === FilePrompt.Settings &&
        <FileSettingsPrompt
          backend={this.props.backend}
          close={this.hidePrompt}
          file={this.state.file!}
          showDeletePrompt={this.showDeletePrompt}
          success={this.settingsSuccessfullyChanged}
          token={this.props.token}
        />
      }

      <a style={{ display: 'none' }} ref={this.linkRef}></a>
    </div>);
    /* eslint-enable jsx-a11y/anchor-has-content */
    /* eslint-enable jsx-a11y/anchor-is-valid */
  }

  loadFileDetails = async () => {
    try {
      const file = await this.props.backend.getFileDetails(this.props.token!, this.getID());
      this.setState({
        file: file,
      });
      return file;
    } catch (err) {
      console.log(err);
      this.setState({
        errorMessage: 'Error loading file details.',
      });
    }
    return null;
  }

  loadTags = async (file: File) => {
    try {
      const tags = await this.props.backend.getTags(this.props.token, file.fileID);
      this.setState({
        tags: tags,
      });
    } catch (err) {
      console.log(err);
      this.props.displayError('Error loading tags.');
    }
  }

  loadProjectDetails = async () => {
    if (!this.state.file || !this.state.file.projID) {
      return;
    }

    try {
      const project = await this.props.backend.getProjectDetails(this.props.token, this.state.file!.projID!);
      this.setState({
        project: project,
      });
    } catch (err) {
      console.log(err);
      this.setState({
        errorMessage: 'Error loading file details.',
      });
    }
  }

  loadOrganizationDetails = async () => {
    if (!this.state.project) {
      return;
    }

    try {
      const organization = await this.props.backend.getOrganizationDetails(this.props.token, this.state.project.organizationID);
      this.setState({
        organization: organization,
      });
    } catch (err) {
      console.log(err);
      this.setState({
        errorMessage: 'Error loading file details.',
      });
    }
  }

  downloadClicked = async (extension?: string) => {
    try {
      const blob = await this.props.backend.downloadFile(this.props.token, this.getID(), extension);
      const url = window.URL.createObjectURL(blob);
      this.linkRef.current!.href = url;
      this.linkRef.current!.download = replaceExtension(this.state.file!.name, extension);
      this.linkRef.current!.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.log(err);
      this.props.displayError('Error encountered while downloading file.');
    }
  }

  downloadDisplayImage = async () => {
    try {
      const blob = await this.props.backend.downloadFile(this.props.token, this.getID(), 'png');
      const url = window.URL.createObjectURL(blob);
      this.setState({
        imageDisplayUrl: url,
      });
    } catch (err) {
      console.log(err);
      this.props.displayError('Error encountered while loading display image.');
    }
  }

  updateTags = (tags: string[]) => {
    this.setState({
      tags: tags,
    });
  }

  hidePrompt = () => {
    this.setState({
      visiblePrompt: null,
    });
  }

  showDeletePrompt = () => {
    this.setState({
      visiblePrompt: FilePrompt.Delete,
    });
  }

  showSettingsPrompt = () => {
    this.setState({
      visiblePrompt: FilePrompt.Settings,
    });
  }

  settingsSuccessfullyChanged = (file: File) => {
    this.setState({
      file: file,
    });
    this.hidePrompt();
  }

  setRedirectToProject = () => {
    if (!this.state.project) {
      this.setState({
        redirect: '/'
      });
    } else {
      this.setState({
        redirect: '/projects/' + this.state.project.projectID,
      });
    }
  }

  getID = () => {
    return Number(this.props.match.params.id);
  }
}

function replaceExtension(path: string, extension?: string) {
  if (extension === undefined) {
    return path;
  }
  const i = path.lastIndexOf('.');
  return path.substring(0, i + 1) + extension;
}
