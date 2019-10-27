import { NOT_FOUND } from 'http-status-codes';
import React from 'react';
import { Redirect, RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import Breadcrumb from '../Components/Breadcrumb';
import Loader from '../Components/Loader';
import DeleteProjectPrompt from '../Components/Prompts/DeleteProjectPrompt';
import ProjectSettingsPrompt from '../Components/Prompts/ProjectSettingsPrompt';
import UploadFilePrompt from '../Components/Prompts/UploadPrompt';
import { Backend } from '../Data/Backend';
import { File } from '../Models/File';
import { Organization } from '../Models/Organization';
import { Project } from '../Models/Project';
import NotFound from './NotFound';

enum ProjectPrompt {
  Delete,
  Settings,
  Upload,
}

interface Props extends RouteComponentProps<{ id: string }> {
  backend: Backend;
  token: string;
}

interface State {
  files: File[],
  loading: boolean;
  notFound: boolean;
  organization: Organization | null;
  project: Project | null;
  redirect: string | null;
  visiblePrompt: ProjectPrompt | null;
}

export default class ProjectDetails extends React.Component<Props, State> {
  constructor(props: any) {
    super(props)
    this.state = {
      files: [],
      loading: true,
      notFound: false,
      organization: null,
      project: null,
      redirect: null,
      visiblePrompt: null,
    };
  }

  async componentDidMount() {
    const projectID = this.getProjectID();
    if (projectID) {
      this.setState({
        loading: true,
      });

      const project = await this.loadProject(this.props.token, projectID);
      if (project) {
        await this.loadOrganization(this.props.token, project.organizationID);
      }

      const files = await this.loadFiles(this.props.token, projectID);
      if (files) {
        await this.loadTags(this.props.token, files);
      }

      this.setState({
        loading: false,
      });
    } else {
      this.setState({
        redirect: '/'
      });
    }
  }

  async componentDidUpdate(oldProps: Props) {
    if (this.props.token !== oldProps.token || this.props.match.params.id !== oldProps.match.params.id) {
      await this.componentDidMount();
    }
  }

  render() {
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />;
    }

    if (this.state.loading) {
      return <Loader />;
    }

    if (this.state.notFound) {
      return <NotFound />;
    }

    return (<div>
      <Breadcrumb
        links={[
          [this.state.organization!.name, "/organizations/" + this.state.organization!.organizationID],
          [this.state.project!.name, "/projects/" + this.state.project!.projectID],
        ]}
      />

      <nav className="level">
        <div className="level-left">
          <h1 className="title">
            {this.state.project!.name}
          </h1>
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

      <p className="content">
        {this.state.project!.description}
      </p>

      <div className="content">
        <ReactTable
          columns={[
            { Header: 'Name', accessor: 'name', Cell: props => <Link to={"/file/" + props.original.fileID}>{props.value}</Link> },
            { Header: 'Uploader', accessor: f => f.uploader ? f.uploader.email : '', id: 'uploader' },
            { Header: 'Tags', accessor: 'tags', Cell: props => props.value.join(', ') },
          ]}
          data={this.state.files}
          defaultPageSize={10}
          defaultSorted={[{ id: 'name', desc: false }]}
        />
      </div>

      {this.state.visiblePrompt === ProjectPrompt.Delete &&
        <DeleteProjectPrompt
          backend={this.props.backend}
          close={this.closePrompt}
          organization={this.state.organization!}
          project={this.state.project!}
          success={this.redirectToOrganization}
          token={this.props.token}
        />
      }

      {this.state.visiblePrompt === ProjectPrompt.Settings &&
        <ProjectSettingsPrompt
          backend={this.props.backend}
          close={this.closePrompt}
          project={this.state.project!}
          showDeletePrompt={this.showDeletePrompt}
          success={this.projectUpdated}
          token={this.props.token}
        />
      }

      {this.state.visiblePrompt === ProjectPrompt.Upload &&
        <UploadFilePrompt
          backend={this.props.backend}
          close={this.closePrompt}
          closeWithSuccess={this.fileSuccessfullyUploaded}
          project={this.state.project!}
          token={this.props.token}
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

  redirectToOrganization = () => {
    this.setState({
      redirect: '/organizations/' + this.state.organization!.organizationID,
    });
  }

  loadProject = async (token: string, projectID: number) => {
    try {
      const loadedProject = await this.props.backend.getProjectDetails(token, projectID);
      this.setState({
        project: loadedProject,
      });
      return loadedProject;
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
    return null;
  }

  loadOrganization = async (token: string, organizationID: number) => {
    try {
      const organization = await this.props.backend.getOrganizationDetails(token, organizationID);
      this.setState({
        organization: organization,
      });
    } catch (err) {
      console.log(err);
      // TODO handle error
    }
  }

  loadFiles = async (token: string, projectID: number) => {
    try {
      const files = await this.props.backend.listFiles(token, projectID);
      this.setState({
        files: files,
      });
      return files;
    } catch (err) {
      // TODO
      console.log(err);
    }
    return null;
  }

  loadTags = async (token: string, files: File[]) => {
    try {
      const fileTags = await Promise.all(
        files.map((file) => this.props.backend.getTags(token, file.fileID)));

      const modifiedFiles: File[] = [];
      fileTags.forEach((tags, i) => {
        modifiedFiles.push({ ...files[i], tags: tags });
      });
      this.setState({
        files: modifiedFiles,
      });
    } catch (err) {
      console.log(err);
      // TODO
    }
  }

  getProjectID = () => {
    return Number(this.props.match.params.id);
  }
}
