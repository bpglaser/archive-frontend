import React from 'react';
import { Backend } from '../Data/Backend';
import { Project } from '../Models/Project';
import Loader from './Loader';
import ProjectPreviewCard from './ProjectPreviewCard';
import MoreProjectsCard from './MoreProjectsCard';
import ErrorPage from './ErrorPage';
import { createErrorMessage } from '../Helpers';

interface Props {
  backend: Backend;
  token: string;
}

interface State {
  error: string | null;
  loading: boolean;
  projects: Project[];
}

export default class RecentProjects extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      error: null,
      loading: true,
      projects: [],
    };
  }

  async componentDidMount() {
    await this.loadRecentProjects();
    this.setState({
      loading: false,
    });
  }

  render() {
    if (this.state.loading) {
      return <Loader />;
    }

    if (this.state.error) {
      return <ErrorPage errorMessage={this.state.error} />;
    }

    return (<div style={{ display: "flex", flexFlow: "row wrap" }}>
      {
        this.state.projects.map((project, i) => <ProjectPreviewCard project={project} key={i} />)
      }
      <MoreProjectsCard />
    </div>);
  }

  loadRecentProjects = async () => {
    try {
      const { backend, token } = this.props;
      const projects = await backend.getRecentProjects(token!);
      this.setState({
        projects: projects,
      });
    } catch (err) {
      this.setState({
        error: createErrorMessage(err, 'Error encountered while loading recent projects.'),
      });
    }
  }
}
