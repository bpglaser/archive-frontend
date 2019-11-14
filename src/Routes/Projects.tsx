import * as React from 'react';
import { Redirect } from 'react-router';
import Breadcrumb from '../Components/Breadcrumb';
import Loader from '../Components/Loader';
import ProjectPreviewCard from '../Components/ProjectPreviewCard';
import { Backend } from '../Data/Backend';
import { Organization } from '../Models/Organization';
import { Project } from '../Models/Project';

interface Props {
  backend: Backend;
  token: string | null;
}

interface State {
  errorMessage: string | null;
  loading: boolean;
  myProjects: [Organization, Project[]][];
  publicProjects: Project[];
  redirect: string | null;
}

function initialState(): State {
  return {
    errorMessage: null,
    loading: true,
    myProjects: [],
    publicProjects: [],
    redirect: null,
  };
}

export default class Projects extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = initialState();
  }

  async componentDidMount() {
    this.setState(initialState());

    await this.loadMyProjects();
    await this.loadPublicProjects();

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

    return (<div>
      <Breadcrumb
        links={[
          ["All Projects", "/projects"],
        ]}
      />

      <h3 className="title is-3">Public Projects</h3>

      {
        this.state.publicProjects.map((project, i) =>
          <ProjectPreviewCard project={project} key={i} />)
      }

      {this.state.myProjects.length > 0 &&
        <h3 className="title is-3">My Projects</h3>
      }
      {this.state.myProjects.length > 0 &&
        this.state.myProjects.map(([organization, projects], i) =>
          <div key={i}>
            <h4 className="title is-4">{organization.name}</h4>
            {
              projects.map((project, j) =>
                <ProjectPreviewCard project={project} key={j} />)
            }
          </div>
        )
      }
    </div>);
  }

  loadMyProjects = async () => {
    if (this.props.token === null) {
      return;
    }

    try {
      const organizations = await this.props.backend.listOrganizations(this.props.token);

      const myProjects: [Organization, Project[]][] = [];
      for (const organization of organizations) {
        const projects = await this.props.backend.listProjects(this.props.token, organization.organizationID);
        const pair: [Organization, Project[]] = [organization, projects];
        myProjects.push(pair);
      }

      this.setState({
        myProjects: myProjects,
      });
    } catch (err) {
      this.setState({
        errorMessage: 'Failed to load my projects.',
      });
    }
  }

  loadPublicProjects = async () => {
    try {
      const publicProjects = await this.props.backend.getPublicProjects();
      this.setState({
        publicProjects: publicProjects,
      });
    } catch (err) {
      this.setState({
        errorMessage: 'Failed to load public projects.',
      });
    }
  }
}
