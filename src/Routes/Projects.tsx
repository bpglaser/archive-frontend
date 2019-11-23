import * as React from 'react';
import { Redirect } from 'react-router';
import Breadcrumb from '../Components/Breadcrumb';
import Loader from '../Components/Loader';
import ProjectsTable from '../Components/ProjectsTable';
import { Backend } from '../Data/Backend';
import { createErrorMessage } from '../Helpers';
import { Project } from '../Models/Project';

interface Props {
  backend: Backend;
  token: string | null;
}

interface State {
  errorMessage: string | null;
  loading: boolean;
  publicProjects: Project[];
  redirect: string | null;
}

function initialState(): State {
  return {
    errorMessage: null,
    loading: true,
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

      <ProjectsTable
        projects={this.state.publicProjects}
      />
    </div>);
  }
  loadPublicProjects = async () => {
    try {
      const publicProjects = await this.props.backend.getPublicProjects();
      this.setState({
        publicProjects: publicProjects,
      });
    } catch (err) {
      console.log(err);
      this.setState({
        errorMessage: createErrorMessage(err, 'Failed to load public projects.'),
      });
    }
  }
}
