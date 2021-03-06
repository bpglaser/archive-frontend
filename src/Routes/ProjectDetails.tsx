import { NOT_FOUND, UNAUTHORIZED } from 'http-status-codes';
import moment from 'moment';
import React from 'react';
import { Redirect, RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';
import ReactTable, { Filter } from 'react-table';
import 'react-table/react-table.css';
import Breadcrumb from '../Components/Breadcrumb';
import ErrorPage from '../Components/ErrorPage';
import Loader from '../Components/Loader';
import DeleteProjectPrompt from '../Components/Prompts/DeleteProjectPrompt';
import ProjectSettingsPrompt from '../Components/Prompts/ProjectSettingsPrompt';
import UploadFilePrompt from '../Components/Prompts/UploadPrompt';
import { Backend } from '../Data/Backend';
import { readTokenPayload, lowercaseFilterMethod } from '../Helpers';
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
  token: string | null;
}

interface State {
  errorMessage: string | null;
  files: File[];
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
      errorMessage: null,
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
      const details = [];
      if (this.props.token && project) {
        details.push(this.loadOrganization(this.props.token, project.organizationID));
      }

      details.push(this.loadFiles(this.props.token, projectID));

      await Promise.all(details);

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

    if (this.state.errorMessage) {
      return <ErrorPage errorMessage={this.state.errorMessage} />;
    }

    return (<div>
      {
        this.state.organization ?
          <Breadcrumb
            links={[
              [this.state.organization!.name, "/organizations/" + this.state.organization!.organizationID],
              [this.state.project!.name, "/projects/" + this.state.project!.projectID],
            ]}
          />
          :
          <Breadcrumb
            links={[
              [this.state.project!.name, "/projects/" + this.state.project!.projectID],
            ]}
          />
      }

      <div className="columns">
        <div className="column">
          <h1 className="title">
            {this.state.project!.name}
          </h1>
        </div>

        {this.props.token &&
          <div className="column is-narrow">
            <div className="field is-grouped">
              <p className="control">
                <button className="button" onClick={this.showUploadPrompt}>
                  <span className="icon">
                    <i className="fas fa-upload"></i>
                  </span>
                  <span>
                    Upload
                </span>
                </button>
              </p>

              {this.isProjectOwned() &&
                < p className="control">
                  <button className="button" onClick={this.showSettingsPrompt}>
                    <span className="icon">
                      <i className="fas fa-cog"></i>
                    </span>
                  </button>
                </p>
              }
            </div>
          </div>
        }
      </div>

      <p className="content">
        {this.state.project!.description}
      </p>

      <div className="content">
        <ReactTable
          columns={[
            { Header: 'Uploaded', accessor: 'uploaded', filterable: false, Cell: props => <span>{moment(props.value).format('L LT')}</span> },
            { Header: 'Name', accessor: 'name', Cell: props => <Link to={"/file/" + props.original.fileID}>{props.value}</Link> },
            { Header: 'Uploader', accessor: f => f.uploader ? f.uploader.username : '', id: 'uploader' },
            { Header: 'Observer', accessor: 'observer' },
            { Header: 'Object', accessor: 'object' },
            { Header: 'Tags', accessor: 'tags', Cell: props => props.value ? props.value.join(', ') : '', filterMethod: tagFilterMethod },
          ]}
          data={this.state.files}
          defaultPageSize={10}
          defaultSorted={[{ id: 'uploaded', desc: true }]}
          defaultFilterMethod={lowercaseFilterMethod}
          filterable
        />
      </div>

      {
        this.props.token && this.state.visiblePrompt === ProjectPrompt.Delete &&
        <DeleteProjectPrompt
          backend={this.props.backend}
          close={this.closePrompt}
          organization={this.state.organization!}
          project={this.state.project!}
          success={this.redirectToOrganization}
          token={this.props.token}
        />
      }

      {
        this.props.token && this.state.visiblePrompt === ProjectPrompt.Settings &&
        <ProjectSettingsPrompt
          backend={this.props.backend}
          close={this.closePrompt}
          project={this.state.project!}
          showDeletePrompt={this.showDeletePrompt}
          success={this.projectUpdated}
          token={this.props.token}
        />
      }

      {
        this.props.token && this.state.visiblePrompt === ProjectPrompt.Upload &&
        <UploadFilePrompt
          backend={this.props.backend}
          close={this.closePrompt}
          closeWithSuccess={this.fileSuccessfullyUploaded}
          project={this.state.project!}
          token={this.props.token}
        />
      }
    </div >);
  }

  closePrompt = () => {
    this.setState({
      visiblePrompt: null,
    });
  }

  fileSuccessfullyUploaded = (file: File) => {
    this.setState((oldState) => ({
      files: [file, ...oldState.files],
    }));
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

  loadProject = async (token: string | null, projectID: number) => {
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
        } else if (err.response.status === UNAUTHORIZED) {
          this.setState({
            errorMessage: 'Unauthorized',
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
      if (err.response && err.response.status === UNAUTHORIZED && err.response.data.message === 'role') {
        // public projects can't access organizations so we just pass
        return;
      } else {
        console.log(err);
        this.setState({
          errorMessage: 'Failed to load organization details.',
        })
      }
    }
  }

  loadFiles = async (token: string | null, projectID: number) => {
    try {
      const files = await this.props.backend.listFiles(token, projectID);
      this.setState({
        files: files,
      });
    } catch (err) {
      console.log(err);
      this.setState({
        errorMessage: 'Failed to load files.',
      });
    }
  }

  getProjectID = () => {
    return Number(this.props.match.params.id);
  }

  isProjectOwned = () => {
    if (this.props.token && this.state.project) {
      const user = readTokenPayload(this.props.token);
      return this.state.project.owner.userID === user.userID;
    }
    return false;
  }
}

function tagFilterMethod(filter: Filter, row: any, column: any) {
  const tags: string[] = row[filter.id];
  for (const tag of tags) {
    if (tag.toLowerCase().includes(filter.value.toLowerCase())) {
      return true;
    }
  }
  return false;
}
