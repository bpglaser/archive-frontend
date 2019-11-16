import React from 'react';
import { Backend } from '../Data/Backend';
import { Project } from '../Models/Project';
import ErrorPage from './ErrorPage';
import Loader from './Loader';
import ProjectPreviewCard from './ProjectPreviewCard';
import MoreProjectsCard from './MoreProjectsCard';
import { createErrorMessage } from '../Helpers';

interface Props {
  backend: Backend;
}

interface State {
  errorMessage: string | null;
  loading: boolean;
  projects: Project[];
}

export default class PublicProjects extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      errorMessage: null,
      loading: true,
      projects: [],
    };
  }

  async componentDidMount() {
    this.setState({
      loading: true,
    });

    await this.loadProjects();

    this.setState({
      loading: false,
    });
  }

  render() {
    if (this.state.errorMessage) {
      return <ErrorPage errorMessage={this.state.errorMessage} retry={this.reloadProjects} />;
    }

    if (this.state.loading) {
      return <Loader />;
    }

    return (<div style={{ display: "flex", flexFlow: "row wrap" }}>
      {
        this.state.projects.map((project, i) =>
          <ProjectPreviewCard project={project} key={i} />)
      }

      <MoreProjectsCard />
    </div>);
  }

  loadProjects = async () => {
    try {
      const projects = await this.props.backend.getPublicProjects();
      this.setState({
        projects: projects,
      });
    } catch (err) {
      console.log(err);
      this.setState({
        errorMessage: createErrorMessage(err, 'Failed to load public projects.'),
      });
    }
  }

  reloadProjects = async () => {
    this.setState({
      errorMessage: null,
      loading: true,
    });

    await this.loadProjects();

    this.setState({
      loading: false,
    });
  }
}
